import type { Question } from "~/types";

let questionsPromise: Promise<Question[]> | null = null;

export function fetchQuestions(): Promise<Question[]> {
  if (!questionsPromise) {
    questionsPromise = import("./furry_questions.json").then((m) => m.default as Question[]);
  }
  return questionsPromise;
}
