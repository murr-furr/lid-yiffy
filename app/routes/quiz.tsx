import { useState, useEffect } from "react";
import { Link } from "react-router";
import questionsData from "../data/furry_questions.json";
import { QuestionCard } from "~/components/QuestionCard";
import type { Question } from "~/types";

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    // Shuffle only on client side to avoid hydration mismatch
    setQuestions(shuffleArray(questionsData as Question[]));
  }, [resetKey]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    if (selectedOption === currentQuestion.answer) {
      setScore(score + 1);
    }

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
  };

  const handleCheck = () => {
      if (selectedOption) {
          setShowResult(true);
      }
  };

  // While questions are being shuffled (initial render), show loading or nothing.
  // Since we start with empty array, currentQuestion will be undefined.
  if (questions.length === 0) {
      return (
          <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-10 px-4">
              <div className="text-xl text-muted-foreground">Shuffling questions... qwq</div>
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
        <div className="mt-2 text-muted-foreground font-medium" aria-live="polite">Score: {score}</div>
      </header>

      <main className="w-full flex flex-col items-center">
        {currentQuestion ? (
          <div className="w-full flex flex-col items-center gap-6">
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
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-full shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        Check Answer OwO
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        Next Question &rarr;
                    </button>
                )}
            </div>
          </div>
        ) : (
            <div className="text-xl text-muted-foreground">Loading questions... or maybe none found qwq</div>
        )}
      </main>
    </div>
  );
}
