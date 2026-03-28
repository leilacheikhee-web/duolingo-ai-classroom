# Welcome to 06 Ai Integration
***

## Task
The challenge is to integrate Large Language Model (LLM) capabilities into an existing educational platform. The problem involves implementing real-time AI streaming responses, multi-mode tutoring (grammar correction, translation, conversation practice), and building a production-ready architecture that handles API security, error states, and seamless user experience for language learners.

## Description
Built an AI-powered Duolingo-style classroom using Next.js 14 App Router with TypeScript and Anthropic Claude API. The solution implements:
- **LLM Service Abstraction Layer** (`src/lib/llm-service.ts`) - reusable utilities with prompt templates for tutor, grammar, and translation modes
- **Streaming API Route** (`src/app/api/chat/route.ts`) - Server-Sent Events (SSE) for real-time Claude AI response streaming
- **Grammar Check API** (`src/app/api/grammar/route.ts`) - AI-powered grammar correction with explanations
- **Translation API** (`src/app/api/translate/route.ts`) - Multi-language translation with cultural context
- **Custom React Hook** (`src/hooks/useStreamingChat.ts`) - streaming state management with AbortController for cancellation
- **Type-Safe Architecture** (`src/types/chat.ts`) - full TypeScript coverage across all components

## Installation
```bash
npm install
```

Create a `.env.local` file with your Anthropic API key:
```bash
echo "ANTHROPIC_API_KEY=your_api_key_here" > .env.local
```

## Usage
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
```
./duolingo-ai-classroom
├──  Tutor Mode      → Chat with Claude AI for language learning help
├──  Grammar Mode   → AI-powered grammar correction with explanations  
└──  Translation Mode → Translate text to 8 languages with cultural context
```

**Key Features:**
- Real-time streaming AI responses via Server-Sent Events
- Abort controller to cancel streaming mid-response
- 3 AI modes: Tutor, Grammar Checker, Translator
- Type-safe TypeScript architecture throughout
- Anthropic Claude API integration with secure server-side key handling
- Production-ready error handling and fallback states

### The Core Team


<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>

 
.
