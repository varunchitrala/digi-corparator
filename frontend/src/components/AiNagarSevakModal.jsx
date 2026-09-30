import React, { useState } from 'react';
import { Drawer } from './Drawer';
import { Button } from './Button';
import { Sparkles, Send, Bot, User } from 'lucide-react';
import api from '../services/api';

export const AiNagarSevakModal = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Namaste! I am AI NagarSevak, your smart ward management assistant. How can I assist you with Ward 24 telemetry today?'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMsg = prompt;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await api.post('/ai/query', { prompt: userMsg });
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: res.data.reply }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Apologies, I encountered an issue querying ward metrics. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    "Show me all pending complaints in Ward 24",
    "Which development works are currently delayed?",
    "How much fund is available in budget?",
    "Summarize today's important ward issues"
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="AI NagarSevak Assistant">
      <div className="flex flex-col h-[75vh]">
        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto space-y-4 p-2">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-start space-x-2.5 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-slate-800 text-white' : 'bg-amber-500 text-white'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none font-medium'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
              <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
              <span>AI NagarSevak is analyzing ward database...</span>
            </div>
          )}
        </div>

        {/* Quick Sample Queries */}
        <div className="py-2 border-t border-slate-100 flex flex-wrap gap-1.5">
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPrompt(q)}
              className="text-[10px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-1 rounded-md"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={handleSend} className="pt-2 border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask AI NagarSevak anything about your ward..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button type="submit" variant="primary" size="sm" isLoading={loading} className="bg-amber-600 hover:bg-amber-700">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Drawer>
  );
};
