import { Link } from "react-router";
import { fetchQuestions } from "~/data/questionsResource";

export default function Home() {
  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground text-center transition-colors duration-300"
    >
      <div className="max-w-md w-full bg-card text-card-foreground p-10 rounded-3xl shadow-2xl border border-border transform rotate-1 hover:rotate-0 transition duration-500">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
          Life in Furland
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Prepare for your Citizenship Test... the furry way! UwU
        </p>

        <div className="space-y-4">
          <Link
            to="/quiz"
            prefetch="intent"
            onMouseEnter={() => fetchQuestions()}
            onFocus={() => fetchQuestions()}
            className="block w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-6 rounded-2xl shadow-lg transform transition hover:scale-105 active:scale-95 text-xl"
          >
            Start Quiz 🦊
          </Link>

          <div className="text-sm text-muted-foreground mt-6">
            Based on the official "Leben in Deutschland" test.
            <br />
            100% fluff guaranteed.
          </div>
        </div>
      </div>
    </main>
  );
}
