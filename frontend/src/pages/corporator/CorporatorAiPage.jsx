import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Bot, Send, User, Sparkles, MapPin, AlertTriangle } from 'lucide-react';

export const CorporatorAiPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'जय महाराष्ट्र! मी तुमचा AI NagarSevak सहाय्यक आहे. Ward 24 मधील तक्रारी, विकास कामे किंवा बजेट बद्दल विचारा.',
      suggestedActions: [
        { label: '30 दिवसांपेक्षा जुने complaints दाखव', query: 'माझ्या Ward मधील 30 दिवसांपेक्षा जुने complaints दाखव' },
        { label: 'Ward 24 चे बजेट सांगा', query: 'Ward 24 चे बजेट utilization सांगा' }
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendQuery = async (queryText) => {
    const prompt = queryText || inputQuery;
    if (!prompt.trim()) return;

    const userMsg = { sender: 'user', text: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.post('/corporator/ai/query', { query: prompt });
      const aiMsg = {
        sender: 'ai',
        text: res.data.answer,
        suggestedActions: res.data.suggestedActions
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'माफ करा, AI सेवेत त्रुटी आली. कृपया पुन्हा प्रयत्न करा.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-md border border-purple-200 flex items-center w-max">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> AI NAGARSEVAK ASSISTANT
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">AI Ward Query & Intelligence Center</h2>
          <p className="text-xs text-slate-500">Natural language analysis in Marathi & English restricted to Ward 24 scope.</p>
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl p-4 rounded-2xl text-xs space-y-2 ${
                m.sender === 'user' ? 'bg-blue-600 text-white font-medium rounded-br-none' : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-bl-none'
              }`}>
                <div className="flex items-center space-x-2 font-bold text-[11px]">
                  {m.sender === 'user' ? (
                    <>
                      <span>Corporator</span>
                      <User className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <Bot className="w-3.5 h-3.5 text-purple-600" />
                      <span className="text-purple-700">AI NagarSevak</span>
                    </>
                  )}
                </div>

                <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2 border-t border-slate-200/60">
                    {m.suggestedActions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => act.route ? navigate(act.route) : handleSendQuery(act.query)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-purple-700 font-bold rounded-lg border border-purple-200 text-[11px] transition-colors shadow-2xs"
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 p-3 rounded-xl text-xs font-bold text-slate-500 animate-pulse">
                AI NagarSevak is analyzing Ward 24 database...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendQuery(); }} className="p-3 border-t border-slate-200 flex items-center space-x-2">
          <Input
            placeholder="Ward 24 बद्दल प्रश्न विचारा (e.g. 30 दिवसांपेक्षा जुने complaints दाखव)..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="primary" isLoading={loading} className="bg-purple-600 hover:bg-purple-700">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
