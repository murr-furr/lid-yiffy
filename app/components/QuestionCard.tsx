import type { Question } from "~/types";

interface QuestionCardProps {
  question: Question;
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  showResult: boolean;
}

export function QuestionCard({ question, selectedOption, onSelectOption, showResult }: QuestionCardProps) {
  const options = ['a', 'b', 'c', 'd'];

  return (
    <div className="bg-card text-card-foreground rounded-3xl shadow-lg p-8 border border-border max-w-2xl w-full">
      <h2 className="text-xl font-bold mb-6 leading-relaxed">
        {question.question}
      </h2>

      {question.image && (
        <div className="mb-4">
            <div className="bg-muted h-40 rounded-xl flex items-center justify-center text-muted-foreground">
                [Image: {question.image}]
            </div>
        </div>
      )}

      <div className="space-y-3">
        {options.map((opt) => {
          const isSelected = selectedOption === opt;
          const isCorrect = question.answer === opt;

          let cardClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 transform hover:scale-[1.01] ";

          if (showResult) {
            if (isCorrect) {
              cardClass += "bg-green-100 dark:bg-green-900 border-green-500 text-green-800 dark:text-green-100";
            } else if (isSelected) {
              cardClass += "bg-red-100 dark:bg-red-900 border-red-500 text-red-800 dark:text-red-100";
            } else {
              cardClass += "bg-muted text-muted-foreground border-border opacity-50";
            }
          } else {
            if (isSelected) {
              // Primary color usage
              cardClass += "bg-primary/10 border-primary text-primary shadow-sm";
            } else {
              // Default state
              cardClass += "bg-card hover:bg-muted border-input hover:border-primary/50 text-card-foreground";
            }
          }

          return (
            <button
              key={opt}
              onClick={() => !showResult && onSelectOption(opt)}
              disabled={showResult}
              className={cardClass}
            >
              <span className="font-bold mr-2 uppercase text-lg">{opt})</span>
              {question.options[opt as keyof typeof question.options]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
