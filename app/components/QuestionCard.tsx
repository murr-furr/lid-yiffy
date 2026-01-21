import { memo } from "react";
import type { Question } from "~/types";

interface QuestionCardProps {
  question: Question;
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  showResult: boolean;
}

const options = ['a', 'b', 'c', 'd'];

// Optimized with React.memo to prevent unnecessary re-renders when parent state
// (like score or optimistic UI updates) changes but props for this component remain the same.
export const QuestionCard = memo(function QuestionCard({ question, selectedOption, onSelectOption, showResult }: QuestionCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-3xl shadow-lg p-8 border border-border max-w-2xl w-full">
      <h2
        className="text-xl font-bold mb-2 leading-relaxed"
        id="question-text"
      >
        {question.question}
      </h2>
      <p className="text-muted-foreground text-sm italic mb-6">
        {question.original_question}
      </p>

      {question.image && (
        <div className="mb-4">
            <div className="bg-muted h-40 rounded-xl flex items-center justify-center text-muted-foreground" aria-label={`Image for question: ${question.image}`}>
                [Image: {question.image}]
            </div>
        </div>
      )}

      <div
        className="space-y-3"
        role="radiogroup"
        aria-labelledby="question-text"
      >
        {options.map((opt) => {
          const isSelected = selectedOption === opt;
          const isCorrect = question.answer === opt;

          let cardClass = "w-full text-left p-4 rounded-xl border transition-all duration-100 transform flex items-center ";

          // Focus styles
          cardClass += "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ";

          // Active/Click styles (visual feedback)
          cardClass += "active:scale-[0.98] active:brightness-95 ";

          if (showResult) {
            if (isCorrect) {
              cardClass += "bg-green-100 dark:bg-green-900 border-green-500 text-green-900 dark:text-green-100 font-medium";
            } else if (isSelected) {
              cardClass += "bg-red-100 dark:bg-red-900 border-red-500 text-red-900 dark:text-red-100 font-medium";
            } else {
              cardClass += "bg-muted text-muted-foreground border-border opacity-60";
            }
          } else {
            if (isSelected) {
              // Selected state - Use primary color background with visible text
              cardClass += "bg-primary/20 border-primary text-foreground shadow-sm ring-1 ring-primary";
            } else {
              // Default state
              cardClass += "bg-card hover:bg-muted border-input hover:border-primary/50 text-card-foreground shadow-sm";
            }
          }

          return (
            <button
              key={opt}
              onClick={() => !showResult && onSelectOption(opt)}
              disabled={showResult}
              className={cardClass}
              aria-checked={isSelected}
              role="radio"
              aria-label={`Option ${opt.toUpperCase()}: ${question.options[opt as keyof typeof question.options]}`}
            >
              <span className="font-bold mr-2 uppercase text-lg text-primary">{opt})</span>
              <span className="flex-1 text-left flex flex-col justify-center min-h-[3rem]">
                <div className="font-medium">{question.options[opt as keyof typeof question.options]}</div>
                {question.original_options && (
                  <div className="text-sm text-muted-foreground/80 italic mt-0.5">
                    {question.original_options[opt as keyof typeof question.options]}
                  </div>
                )}
              </span>
              {!showResult && (
                <span
                  className="hidden sm:inline-block ml-3 text-xs font-mono text-muted-foreground/70 bg-muted/50 border border-border px-2 py-0.5 rounded shadow-[0px_1px_0px_0px_rgba(0,0,0,0.1)] select-none"
                  aria-hidden="true"
                >
                  {opt === "a" ? "1" : opt === "b" ? "2" : opt === "c" ? "3" : "4"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="sr-only">
        {showResult && (
            selectedOption === question.answer
            ? "Correct answer!"
            : `Incorrect. The correct answer was ${question.answer.toUpperCase()}.`
        )}
      </div>
    </div>
  );
});
