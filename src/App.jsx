import { useState } from 'react';
import { Send, Settings, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { sendToOpenAI } from './api/openai';
import './App.css';

export default function App() {
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  console.log('API key:', import.meta.env.VITE_OPENAI_API_KEY);

   const handleSubmit = async (e) => {
    e.preventDefault();
    const userMsg = message.trim();
    if (!userMsg) return;

    // 1) Adiciona mensagem do usuário ao histórico
    const updatedLog = [...chatLog, { role: 'user', content: userMsg }];
    setChatLog(updatedLog);
    setMessage('');
    setLoading(true);

    try {
      // 2) Chama a OpenAI
      const aiReply = await sendToOpenAI(updatedLog);
      // 3) Atualiza o histórico com a resposta
      setChatLog(prev => [...prev, { role: 'assistant', content: aiReply }]);
    } catch (err) {
      console.error(err);
      setChatLog(prev => [...prev, { role: 'assistant', content: 'Desculpe, tive um erro ao processar sua solicitação.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Botão de seta - substitui o menu hambúrguer */}
      <button 
        className="mobile-menu-button sidebar-toggle-arrow"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Sidebar - trapezoid shape */}
      <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="user-avatar"></div>
          </div>

          <div className="sidebar-nav">
            <a href="#" className="nav-item">
              <ChevronRight size={12} />
            </a>
            <a href="#" className="nav-item">
              <Calendar size={24} />
            </a>
            <a href="#" className="nav-item">
              <Settings size={24} />
            </a>
          </div>

          <div className="sidebar-footer">
            
          </div>
        </div>
      </div>

      {/* Main content */}
   <div className="main-content">
  {/* Chat area */}
  <div className="chat-area">
    <div className="chat-container">
      <div className="messages">
        {chatLog.length === 0 && (
          <div className="message assistant-message">
            <p>Olá! Como eu posso te ajudar hoje?</p>
          </div>
        )}
        {chatLog.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            <p>{msg.content}</p>
          </div>
        ))}
        {loading && (
          <div className="message assistant-message">
            <p>Digitando...</p>
          </div>
        )}
      </div>
    </div>
  </div>
        
        {/* Input area */}
        <div className="input-area">
          <div className="input-container">
            <form onSubmit={handleSubmit} className="message-form">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mensagem para a IA Assistente..."
                className="message-input"
              />
              <button 
                type="submit" 
                className="send-button"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Overlay for mobile - only visible when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div 
          className="mobile-overlay"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}