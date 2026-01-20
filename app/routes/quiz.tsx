import { useState, useEffect, useLayoutEffect, useOptimistic, useTransition, use, Suspense, useRef } from "react";
import { Link } from "react-router";
import { QuestionCard } from "~/components/QuestionCard";
import type { Question } from "~/types";
import { fetchQuestions } from "~/data/questionsResource";

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  const randomBuffer = new Uint32Array(1);
  for (let i = newArray.length - 1; i > 0; i--) {
    // Use crypto.getRandomValues for better randomness (Sentinel security enhancement)
    crypto.getRandomValues(randomBuffer);
    const j = randomBuffer[0] % (i + 1);
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Simulated async verification
async function verifyAnswer(selected: string, correct: string): Promise<boolean> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(selected === correct), 50); // Small delay to demonstrate optimistic UI
    });
}

function QuizGame({ initialQuestions }: { initialQuestions: Question[] }) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const [optimisticScore, addOptimisticScore] = useOptimistic(
      score,
      (state, amount: number) => state + amount
  );

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Shuffle on mount/reset
    startTransition(() => {
        setQuestions(shuffleArray(initialQuestions));
    });
  }, [initialQuestions, resetKey]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    startTransition(() => {
        setSelectedOption(null);
        setShowResult(false);

        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          alert(`Quiz finished! Score: ${score + (selectedOption === currentQuestion.answer ? 1 : 0)}/${questions.length} uwu`);
          setCurrentQuestionIndex(0);
          setScore(0);
          setResetKey(prev => prev + 1);
        }
    });
  };

  const handleCheck = async () => {
      if (selectedOption) {
          // Optimistic update
          if (selectedOption === currentQuestion.answer) {
              startTransition(() => {
                  addOptimisticScore(1);
              });
          }

          // Real check (simulated async)
          const isCorrect = await verifyAnswer(selectedOption, currentQuestion.answer);

          if (isCorrect) {
              setScore(s => s + 1);
          }
          setShowResult(true);
      }
  };

  // Keep a stable reference to the latest handlers and state
  const handlersRef = useRef({ handleNext, handleCheck, showResult, selectedOption, isPending, setSelectedOption });
  useLayoutEffect(() => {
      handlersRef.current = { handleNext, handleCheck, showResult, selectedOption, isPending, setSelectedOption };
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Access the latest state/handlers via the ref
      const { handleNext, handleCheck, showResult, selectedOption, isPending, setSelectedOption } = handlersRef.current;

      if (isPending) return;

      const key = e.key.toLowerCase();
      const isInteractiveElement =
        document.activeElement instanceof HTMLButtonElement ||
        document.activeElement instanceof HTMLAnchorElement ||
        document.activeElement instanceof HTMLInputElement;

      if (key === "enter") {
        // Check if the active element is one of the option buttons
        const isOptionButton =
          document.activeElement instanceof HTMLButtonElement &&
          document.activeElement.getAttribute("role") === "radio";
        const isSelectedOptionButton =
          isOptionButton &&
          document.activeElement.getAttribute("aria-checked") === "true";

        if (showResult) {
          // Prevent hijacking Enter if user is interacting with other elements (e.g. Back link)
          if (!isInteractiveElement) {
            e.preventDefault();
            handleNext();
          }
          return;
        }

        if (selectedOption) {
          // If we are focused on the ALREADY SELECTED option button, treat Enter as Submit.
          if (isSelectedOptionButton) {
            e.preventDefault();
            handleCheck();
            return;
          }

          // If we are focused on a DIFFERENT option button, let it select (default behavior).
          if (isOptionButton && !isSelectedOptionButton) {
            return;
          }

          // If focus is NOT on an interactive element (e.g. body), Submit.
          if (!isInteractiveElement) {
            e.preventDefault();
            handleCheck();
            return;
          }
        }
      }

      if (!showResult) {
        const optionMap: Record<string, string> = {
          "1": "a",
          a: "a",
          "2": "b",
          b: "b",
          "3": "c",
          c: "c",
          "4": "d",
          d: "d",
        };

        if (optionMap[key]) {
          setSelectedOption(optionMap[key]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
        window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array ensures this effect runs only once

  if (!currentQuestion) {
      return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-10 px-4">
            <div className="text-xl text-muted-foreground">Preparing questions... qwq</div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-10 px-4 transition-colors duration-300">
      <header className="mb-8 text-center">
        <Link
            to="/"
            className="text-primary hover:text-primary/80 hover:underline mb-2 block transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2"
        >
            &larr; Back to Den
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Question {currentQuestionIndex + 1} / {questions.length}</h1>
        <div className="w-full max-w-2xl mx-auto h-2 bg-secondary rounded-full overflow-hidden mt-4 mb-2">
            <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                role="progressbar"
                aria-valuenow={currentQuestionIndex + 1}
                aria-valuemin={1}
                aria-valuemax={questions.length}
                aria-label={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
            />
        </div>
        <div className="mt-2 text-muted-foreground font-medium" aria-live="polite">
            Score: {optimisticScore}
            {optimisticScore !== score && <span className="text-xs ml-2 opacity-50">(saving...)</span>}
        </div>
      </header>

      <main className="w-full flex flex-col items-center">
        <div className={`w-full flex flex-col items-center gap-6 ${isPending ? 'opacity-70' : ''}`}>
            <QuestionCard
              question={currentQuestion}
              selectedOption={selectedOption}
              onSelectOption={setSelectedOption}
              showResult={showResult}
            />

            <div className="flex gap-4">
                {!showResult ? (
                    <button
                        onClick={handleCheck}
                        disabled={!selectedOption}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-full shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex items-center gap-2"
                    >
                        Check Answer OwO
                        <span className="hidden sm:inline-block text-[10px] font-mono bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30 px-1.5 py-0.5 rounded shadow-sm opacity-90" aria-hidden="true">
                            ↵ Enter
                        </span>
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex items-center gap-2"
                    >
                        Next Question &rarr;
                        <span className="hidden sm:inline-block text-[10px] font-mono bg-white/20 text-white border border-white/30 px-1.5 py-0.5 rounded shadow-sm opacity-90" aria-hidden="true">
                            ↵ Enter
                        </span>
                    </button>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}

function QuizContainer() {
    // use() hook to unwrap promise (Suspense)
    const questions = use(fetchQuestions());
    return <QuizGame initialQuestions={questions} />;
}

export default function Quiz() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-2xl font-bold animate-pulse text-primary">Loading Furry Questions... 🐾</div>
            </div>
        }>
            <QuizContainer />
        </Suspense>
    );
}
