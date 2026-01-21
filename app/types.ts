export interface Question {
  id: string;
  original_question: string;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  original_options?: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  answer: string;
  image: string | null;
  category: string;
}
