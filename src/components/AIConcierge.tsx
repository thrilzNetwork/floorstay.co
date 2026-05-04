import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, ChevronRight } from 'lucide-react';
import { getConciergeResponse } from '../services/geminiService';

export default function AIConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isPublic = window.location.pathname.startsWith('/s/');

  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: isPublic
        ? 'Hi there! Welcome to our Fort Lauderdale properties. I can help with booking, amenities, or local recommendations. What brings you to town?'
        : 'Greetings, Merchant. I am your FloorStay AI concierge. Ask me about inventory, pricing strategy, or guest inquiries.'
    }
  ]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const merchantKB = (window as any).merchantKB || 'Fort Lauderdale hospitality specialists. Crew housing, corporate stays, and vacation rentals.';
      const context = isPublic
        ? `Property/Brand Rules: ${merchantKB}`
        : `Merchant Strategy Memory: ${merchantKB}. Focus on Fort Lauderdale market, crew housing, and direct booking optimization.`;

      const response = await getConciergeResponse(userMsg, context, isPublic ? 'guest' : 'owner');
      setMessages(prev => [...prev, { role: 'ai', content: response || "I couldn't process that." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Error connecting to concierge service.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-4 z-[60] ${isPublic ? 'right-4 md:bottom-8 md:right-8' : 'left-[260px] md:left-[272px] md:bottom-6'}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[calc(100vw-2rem)] sm:w-80 bg-[#141414] text-white rounded-2xl md:rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[400px] md:h-[480px]"
          >
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-[10px] font-bold tracking-widest uppercase">Concierge AI</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 p-5 overflow-y-auto space-y-4 font-sans">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl text-[13px] leading-relaxed ${
                    m.role === 'ai'
                      ? 'bg-white/5 border border-white/10 text-gray-300'
                      : 'bg-white text-black ml-8 font-medium'
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {isLoading && (
                <div className="p-4 rounded-2xl text-[13px] bg-white/5 border border-white/10 text-gray-500 animate-pulse">
                  Concierge is thinking...
                </div>
              )}
            </div>
            <div className="p-5 bg-white/5">
              <div className="relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask your assistant..."
                  className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-medium"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#141414] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform border border-white/20 group"
      >
        <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}
