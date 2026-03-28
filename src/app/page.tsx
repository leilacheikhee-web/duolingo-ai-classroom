import ClassroomChat from "@/components/ClassroomChat";
import GrammarChecker from "@/components/GrammarChecker";
import Translator from "@/components/Translator";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <span>🦜</span> Duolingo AI Classroom
          </h1>
          <p className="text-gray-500 mt-2">
            AI-Powered Language Learning — Integrated with Claude
          </p>
          <div className="flex justify-center gap-2 mt-3">
            {["🤖 Claude AI", "⚡ Streaming", "🌍 Multi-language", "✏️ Grammar Check"].map((badge) => (
              <span key={badge} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat - Takes 2/3 */}
          <div className="lg:col-span-2 h-[600px]">
            <ClassroomChat />
          </div>

          {/* Sidebar Tools */}
          <div className="space-y-4">
            <GrammarChecker />
            <Translator />

            {/* Info Card */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-3">ℹ️ How to Use</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>🎓 <strong>Tutor Mode</strong>: General language assistance</li>
                <li>✏️ <strong>Grammar Mode</strong>: Fix and explain errors</li>
                <li>🌍 <strong>Translation Mode</strong>: Translate with context</li>
                <li>⚡ Responses stream in real-time</li>
                <li>⏹ Stop button cancels generation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
