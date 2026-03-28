"use client";

import { ChatMessage as ChatMessageType } from "@/types/chat";

interface Props {
  message: ChatMessageType;
  isStreaming?: boolean;
}

export default function ChatMessage({ message, isStreaming }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-green-500 text-white"
            : "bg-white border border-gray-200 text-gray-800"
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🦜</span>
            <span className="text-xs font-bold text-green-600 uppercase">
              AI Tutor
            </span>
          </div>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
          {isStreaming && message.role === "assistant" && (
            <span className="inline-block w-2 h-4 bg-green-500 ml-1 animate-pulse" />
          )}
        </p>
        <p className={`text-xs mt-1 ${isUser ? "text-green-100" : "text-gray-400"}`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
