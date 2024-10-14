import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { Send, Bell } from 'lucide-react';

interface Message {
  _id: string;
  sender: { _id: string; name: string };
  recipient: { _id: string; name: string };
  content: string;
  timestamp: string;
  read: boolean;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [notification, setNotification] = useState('');
  const { user } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message: Message) => {
        setMessages(prevMessages => [message, ...prevMessages]);
        setNotification(`Nuevo mensaje de ${message.sender.name}`);
      });
    }

    return () => {
      if (socket) {
        socket.off('newMessage');
      }
    };
  }, [socket]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/messages', {
        recipient,
        content: newMessage
      });
      setMessages(prevMessages => [response.data, ...prevMessages]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Mensajes</h2>
      {notification && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
          <p className="font-bold flex items-center"><Bell className="mr-2" /> {notification}</p>
        </div>
      )}
      <div className="bg-white shadow-md rounded p-4 mb-4">
        <form onSubmit={sendMessage} className="flex items-center">
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="ID del destinatario"
            className="flex-grow mr-2 p-2 border rounded"
            required
          />
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-grow mr-2 p-2 border rounded"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            <Send size={20} />
          </button>
        </form>
      </div>
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message._id} className={`p-4 rounded ${message.sender._id === user._id ? 'bg-blue-100 ml-auto' : 'bg-gray-100'} max-w-[80%]`}>
            <p className="font-bold">{message.sender._id === user._id ? 'Tú' : message.sender.name}</p>
            <p>{message.content}</p>
            <p className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;