import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMessages, sendMessage } from '../../api/messages';
import './styles.css';

const Home = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    loadMessages(token);
  }, [navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (token) => {
    try {
      setIsLoading(true);
      const data = await getMessages(token);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessageText.trim()) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const newMessage = await sendMessage(token, newMessageText.trim());
      setMessages([...messages, newMessage]);
      setNewMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;

    if (messageDate.getTime() === today.getTime()) {
      return time;
    } else {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year} ${time}`;
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="home-container" data-easytag="id1-react/src/components/Home/index.jsx">
      <header className="home-header">
        <h1>Групповой чат</h1>
        <button className="profile-button" onClick={handleProfileClick}>
          Профиль
        </button>
      </header>

      <div className="messages-area">
        {isLoading ? (
          <div className="loading">Загрузка...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">Нет сообщений</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="message-item">
              <div className="message-header">
                <span className="message-author">{message.author_username}</span>
                <span className="message-time">{formatTime(message.created_at)}</span>
              </div>
              <div className="message-text">{message.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="send-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="message-input"
          placeholder="Введите сообщение..."
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
        />
        <button type="submit" className="send-button">
          Отправить
        </button>
      </form>
    </div>
  );
};

export default Home;
