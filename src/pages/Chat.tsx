import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { Send, User } from 'lucide-react';

interface Message {
  _id: string;
  sender: { _id: string; name: string };
  recipient: { _id: string; name: string };
  content: string;
  timestamp: string;
}

interface ChatUser {
  _id: string;
  name: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const { user } = useAuth();
  const { socket } = useSocket();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message: Message) => {
        if (selectedUser && (message.sender._id === selectedUser._id || message.recipient._id === selectedUser._id)) {
          setMessages(prevMessages => [...prevMessages, message]);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('newMessage');
      }
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/messages/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/chat/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await axios.post('http://localhost:5000/api/messages', {
        recipient: selectedUser._id,
        content: newMessage
      });
      setMessages(prevMessages => [...prevMessages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const selectUser = (chatUser: ChatUser) => {
    setSelectedUser(chatUser);
    fetchMessages(chatUser._id);
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        <ul>
          {users.map(chatUser => (
            <li
              key={chatUser._id}
              className={`p-2 cursor-pointer hover:bg-gray-200 ${selectedUser?._id === chatUser._id ? 'bg-gray-300' : ''}`}
              onClick={() => selectUser(chatUser)}
            >
              {chatUser.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 flex flex-col">
        {selectedUser ? (
          <>
            <div className="bg-gray-200 p-4">
              <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
              {messages.map(message => (
                <div
                  key={message._id}
                  className={`mb-4 ${message.sender._id === user?._id ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      message.sender._id === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-300'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="p-4 bg-gray-100 flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-grow p-2 border rounded-l"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded-r">
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Selecciona un usuario para chatear</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;