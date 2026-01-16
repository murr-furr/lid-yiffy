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
    <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-orange-300 max-w-2xl w-full">
      <h2 className="text-xl font-bold mb-6 text-orange-900 leading-relaxed">
        {question.question}
      </h2>

      {question.image && (
        <div className="mb-4">
            {/* Image handling would go here if we had the assets */}
            <div className="bg-gray-200 h-40 rounded-xl flex items-center justify-center text-gray-500">
                [Image: {question.image}]
            </div>
        </div>
      )}

      <div className="space-y-3">
        {options.map((opt) => {
          const isSelected = selectedOption === opt;
          const isCorrect = question.answer === opt;

          let cardClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-[1.02] ";

          if (showResult) {
            if (isCorrect) {
              cardClass += "bg-green-100 border-green-500 text-green-800";
            } else if (isSelected) {
              cardClass += "bg-red-100 border-red-500 text-red-800";
            } else {
              cardClass += "bg-gray-50 border-gray-200 opacity-50";
            }
          } else {
            if (isSelected) {
              cardClass += "bg-orange-100 border-orange-500 text-orange-900 shadow-md";
            } else {
              cardClass += "bg-white border-orange-100 hover:border-orange-300 hover:bg-orange-50 text-gray-700";
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
