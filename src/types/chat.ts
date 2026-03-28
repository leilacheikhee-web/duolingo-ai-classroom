export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  mode?: TutorMode;
}

export type TutorMode = "tutor" | "grammar" | "translation";

export interface GrammarCheckResult {
  original: string;
  correction: string;
  isLoading: boolean;
}

export interface TranslationResult {
  original: string;
  translation: string;
  targetLanguage: string;
  isLoading: boolean;
}

export interface LLMProvider {
  name: string;
  model: string;
  isAvailable: boolean;
}
