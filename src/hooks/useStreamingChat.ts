"use client";

import { useState, useCallback, useRef } from "react";
import { ChatMessage, TutorMode } from "@/types/chat";

export function useStreamingChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentMode, setCurrentMode] = useState<TutorMode>("tutor");
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
        mode: currentMode,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        mode: currentMode,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      abortControllerRef.current = new AbortController();

      try {
        const apiMessages = [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages, mode: currentMode }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) throw new Error("Failed to get response");

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("No reader available");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessage.id
                        ? { ...m, content: m.content + parsed.text }
                        : m
                    )
                  );
                }
              } catch {}
            }
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, content: "Sorry, I encountered an error. Please try again." }
                : m
            )
          );
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [messages, currentMode]
  );

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isStreaming,
    currentMode,
    setCurrentMode,
    sendMessage,
    stopStreaming,
    clearMessages,
  };
}
