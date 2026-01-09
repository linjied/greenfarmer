
import React, { useState, useRef } from 'react';
import { Send, Bot, User, Camera, Image as ImageIcon, Loader2, Sparkles, Upload } from 'lucide-react';
import { getAIAdvice, diagnoseCrop } from '../services/geminiService';

interface Message {
  role: 'user' | 'ai';
  content: string;
  type?: 'text' | 'diagnosis';
}

const AIAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "你好！我是您的 AI 农业助手。今天有什么我可以帮您的吗？您可以咨询种植时间表、病虫害防治，或者使用下方的“一键 AI 诊断”上传照片。" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const advice = await getAIAdvice(userMsg);
    setMessages(prev => [...prev, { role: 'ai', content: advice }]);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setMessages(prev => [...prev, { role: 'user', content: `[图片诊断请求] 上传了文件: ${file.name}` }]);
      setLoading(true);
      const diagnosis = await diagnoseCrop(base64, file.type);
      setMessages(prev => [...prev, { role: 'ai', content: diagnosis, type: 'diagnosis' }]);
      setLoading(false);
      // 清除 input 值以便下次上传同一文件
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const triggerDiagnosis = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* 顶部标题栏 */}
      <div className="p-4 border-b border-slate-100 bg-emerald-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-100">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-lg">AI 农业专家顾问</h2>
            <p className="text-xs text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              在线为您服务
            </p>
          </div>
        </div>
        
        {/* 一键诊断按钮 */}
        <button 
          onClick={triggerDiagnosis}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 border border-emerald-200 rounded-xl text-sm font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-sm hover:shadow-emerald-100 disabled:opacity-50"
        >
          <Sparkles size={18} />
          <span>一键 AI 诊断</span>
        </button>
      </div>

      {/* 聊天内容区 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none shadow-sm shadow-emerald-200' 
                  : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100 shadow-sm whitespace-pre-wrap'
              }`}>
                {msg.type === 'diagnosis' && (
                  <div className="flex items-center gap-2 mb-2 font-bold text-emerald-600 bg-emerald-100/50 px-2 py-1 rounded w-fit">
                    <ImageIcon size={14} />
                    <span>诊断报告</span>
                  </div>
                )}
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100">
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin text-emerald-600" size={20} />
                  <span className="text-sm text-slate-500 italic">正在智能分析中...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部输入框 */}
      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="flex gap-2">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button 
            onClick={triggerDiagnosis}
            className="p-3 text-slate-500 hover:text-emerald-600 bg-white border border-slate-200 rounded-xl transition-colors shadow-sm"
            title="上传图片进行诊断"
          >
            <Camera size={20} />
          </button>
          <input 
            type="text" 
            placeholder="询问任何关于农业的问题..." 
            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-md shadow-emerald-100"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center uppercase tracking-widest font-semibold">
          由 Gemini AI 提供技术支持 - 农业智能分析
        </p>
      </div>
    </div>
  );
};

export default AIAdvisor;
