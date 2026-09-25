import React, { useState } from 'react';
import { ChatMessage } from '../../types';
import { X, Bot, Send, Sparkles, MessageSquare, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextSnippet?: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  contextSnippet = '',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content:
        'I am your SidMorph Writing Assistant. I can explain complex paragraphs, dissect detected similarity patterns, recommend citation placements, or analyze why certain indicators were flagged.',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Explain this paragraph.',
    'Why is this wording similar?',
    'Make this more academic.',
    'Make this concise.',
    'What information may need citation?',
    'Explain the AI-writing indicators.',
  ];

  const handleSend = async (messageText: string) => {
    const textToSend = messageText.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      contextSnippet: contextSnippet ? contextSnippet.slice(0, 300) : undefined,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await api.sendAssistantMessage(textToSend, contextSnippet);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: reply,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#372C2E] border-l border-white/10 h-full flex flex-col text-white shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#D9E48A]" />
            <h3 className="font-serif text-base font-semibold">AI WRITING ASSISTANT</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:text-white text-white/50 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Context Bar */}
        {contextSnippet && (
          <div className="p-3 bg-[#563727]/50 border-b border-white/10 text-xs space-y-1">
            <span className="font-mono text-[10px] uppercase text-[#D9E48A] block">Active Passage Context:</span>
            <p className="text-white/60 italic font-sans line-clamp-2 text-[11px]">
              "{contextSnippet}"
            </p>
          </div>
        )}

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-3 rounded text-xs leading-relaxed max-w-[88%] ${
                  m.role === 'user'
                    ? 'bg-[#D9E48A] text-[#372C2E] font-medium'
                    : 'bg-[#563727]/60 text-white/90 border border-white/5'
                }`}
              >
                {m.content}
              </div>
              <span className="text-[10px] text-white/30 font-mono mt-1 px-1">
                {m.role === 'user' ? 'You' : 'Assistant'}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#D9E48A] font-mono p-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing context...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 border-t border-white/5 bg-[#563727]/20 flex flex-wrap gap-1.5">
          {quickPrompts.slice(0, 4).map((qp) => (
            <button
              key={qp}
              onClick={() => handleSend(qp)}
              disabled={isLoading}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded text-[11px] border border-white/10 transition-colors disabled:opacity-50 text-left"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-white/10 bg-[#372C2E] flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask about this passage or analysis..."
            disabled={isLoading}
            className="flex-1 bg-black/30 border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#D9E48A]"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-[#D9E48A] text-[#372C2E] rounded hover:bg-[#c9d57a] transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
