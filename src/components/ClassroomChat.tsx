"use client";

import { useState, useRef, useEffect } from "react";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import ChatMessageComponent from "./ChatMessage";
import ModeSelector from "./ModeSelector";

export default function ClassroomChat() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isStreaming, currentMode, setCurrentMode, sendMessage, stopStreaming, clearMessages } =
    useStreamingChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    const message = input;
    setInput("");
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = {
    tutor: ["Help me practice Spanish", "Explain past tense in French", "Give me a vocabulary quiz"],
    grammar: ["Check: I goes to school yesterday", "Is this correct: She don't like it"],
    translation: ["Translate 'hello' to Japanese", "How do you say 'thank you' in Arabic"],
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
      {/* Header */}
      <div className="bg-green-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🦜</span>
          <div>
            <h2 className="font-bold text-white text-lg">Duolingo AI Classroom</h2>
            <p className="text-green-100 text-xs">Powered by Claude AI</p>
          </div>
        </div>
        <button
          onClick={clearMessages}
          className="text-green-100 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
        >
          Clear
        </button>
      </div>

      <ModeSelector currentMode={currentMode} onModeChange={setCurrentMode} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <span className="text-5xl">🎓</span>
            <p className="text-gray-500 mt-3 font-medium">Welcome to your AI Language Classroom!</p>
            <p className="text-gray-400 text-sm mt-1">Try one of these to get started:</p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {suggestions[currentMode].map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-xl text-sm hover:bg-green-200 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <ChatMessageComponent
            key={message.id}
            message={message}
            isStreaming={isStreaming && index === messages.length - 1}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask your AI tutor anything... (${currentMode} mode)`}
            className="flex-1 p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 h-12 max-h-32"
            rows={1}
          />
          {isStreaming ? (
            <button
              onClick={stopStreaming}
              className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
            >
              ⏹ Stop
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-4 py-2 bg-green-500 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-green-600 transition-colors"
            >
              Send ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
