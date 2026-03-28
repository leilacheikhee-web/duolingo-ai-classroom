"use client";

import { useState } from "react";

export default function GrammarChecker() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const checkGrammar = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setResult(data.correction);
    } catch {
      setResult("Error checking grammar. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
      <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
        ✏️ Grammar Checker
      </h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your text here to check grammar..."
        className="w-full h-24 p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <button
        onClick={checkGrammar}
        disabled={isLoading || !text.trim()}
        className="mt-2 w-full py-2 bg-green-500 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-green-600 transition-colors"
      >
        {isLoading ? "Checking..." : "Check Grammar"}
      </button>
      {result && (
        <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-200">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </div>
  );
}
