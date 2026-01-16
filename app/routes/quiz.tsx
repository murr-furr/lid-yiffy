import { useState, useMemo } from "react";
import { Link } from "react-router";
import questionsData from "../data/furry_questions.json";
import { QuestionCard } from "~/components/QuestionCard";
import type { Question } from "~/types";

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const questions: Question[] = useMemo(() => questionsData as Question[], []);
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
    }
  };

  const handleCheck = () => {
      if (selectedOption) {
          setShowResult(true);
      }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-10 px-4 transition-colors duration-300">
      <header className="mb-8 text-center">
        <Link to="/" className="text-primary hover:text-primary/80 hover:underline mb-2 block transition-colors">
            &larr; Back to Den
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Question {currentQuestionIndex + 1} / {questions.length}</h1>
        <div className="mt-2 text-muted-foreground font-medium">Score: {score}</div>
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
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-full shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Check Answer OwO
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition active:scale-95"
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
