"use client";

import { useState } from "react";

const LANGUAGES = ["Spanish", "French", "German", "Japanese", "Arabic", "Portuguese", "Italian", "Chinese"];

export default function Translator() {
  const [text, setText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("Spanish");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const translate = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLanguage }),
      });
      const data = await response.json();
      setResult(data.translation);
    } catch {
      setResult("Error translating. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
      <h3 className="font-bold text-gray-700 mb-3">🌍 Translator</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to translate..."
        className="w-full h-20 p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <select
        value={targetLanguage}
        onChange={(e) => setTargetLanguage(e.target.value)}
        className="mt-2 w-full p-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
      <button
        onClick={translate}
        disabled={isLoading || !text.trim()}
        className="mt-2 w-full py-2 bg-blue-500 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-blue-600 transition-colors"
      >
        {isLoading ? "Translating..." : "Translate"}
      </button>
      {result && (
        <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </div>
  );
}
