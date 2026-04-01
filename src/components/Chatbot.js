import React, { useState, useRef, useEffect } from "react";
import { api } from "../services/api";
import "./Chatbot.css";

function Chatbot({ budget, expenses, goals, settings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your AI Financial Advisor. Ask me anything about your budget." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    const updatedMessages = [...messages, { role: "user", text: userMsg }];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await api.chat({
        history: updatedMessages,
        data: { budget, expenses, goals, settings }
      });
      setMessages((prev) => [...prev, { role: "ai", text: response.text }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", text: "Connection error. Ensure the backend is running." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>🤖 Financial Advisor</h3>
            <button onClick={toggleChat}>✕</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && <div className="chat-bubble ai typing">Typing...</div>}
            <div ref={endRef} />
          </div>
          <form className="chatbot-input" onSubmit={sendMessage}>
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask about your budget..." 
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>Send</button>
          </form>
        </div>
      )}
      <button className="chatbot-toggle" onClick={toggleChat}>
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}

export default Chatbot;
