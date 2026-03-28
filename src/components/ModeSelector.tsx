"use client";

import { TutorMode } from "@/types/chat";

interface Props {
  currentMode: TutorMode;
  onModeChange: (mode: TutorMode) => void;
}

const modes = [
  { id: "tutor" as TutorMode, label: "🎓 AI Tutor", desc: "General language help" },
  { id: "grammar" as TutorMode, label: "✏️ Grammar", desc: "Fix grammar mistakes" },
  { id: "translation" as TutorMode, label: "🌍 Translate", desc: "Translate text" },
];

export default function ModeSelector({ currentMode, onModeChange }: Props) {
  return (
    <div className="flex gap-2 p-3 bg-gray-50 border-b">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
            currentMode === mode.id
              ? "bg-green-500 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
          }`}
        >
          <div>{mode.label}</div>
          <div className={`text-xs ${currentMode === mode.id ? "text-green-100" : "text-gray-400"}`}>
            {mode.desc}
          </div>
        </button>
      ))}
    </div>
  );
}
