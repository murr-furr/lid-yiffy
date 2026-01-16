import { Link } from "react-router";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-orange-50 text-center">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border-4 border-orange-300 transform rotate-1 hover:rotate-0 transition duration-500">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          Life in Furland
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Prepare for your Citizenship Test... the furry way! UwU
        </p>

        <div className="space-y-4">
          <Link
            to="/quiz"
            className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform transition hover:scale-105 active:scale-95 text-xl"
          >
            Start Quiz 🦊
          </Link>

          <div className="text-sm text-gray-400 mt-6">
            Based on the official "Leben in Deutschland" test.
            <br />
            100% fluff guaranteed.
          </div>
        </div>
      </div>
    </div>
  );
}
