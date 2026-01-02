import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { Send, User } from 'lucide-react';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const ws = useRef(null);
  const scrollRef = useRef();

  useEffect(() => {
    fetchContacts();
    // Connect WebSocket
    if (user) {
      ws.current = new WebSocket(`ws://localhost:8000/ws/${user.id}`);
      ws.current.onmessage = (event) => {
        // When we receive a notification "NEW_MESSAGE:sender_id"
        // If we are chatting with that sender, refresh messages
        // Or simply refresh contacts to show new snippet
        fetchContacts(); 
        if(activeChat && event.data.includes(activeChat.user_id)) {
            fetchMessages(activeChat.user_id);
        }
      };
    }
    return () => ws.current?.close();
  }, [user, activeChat]);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/messages/contacts');
      setContacts(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await api.get(`/messages/${userId}`);
      setMessages(res.data);
      scrollToBottom();
    } catch (err) { console.error(err); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      await api.post('/messages/', { receiver_id: activeChat.user_id, content: newMessage });
      setMessages([...messages, { sender_id: user.id, content: newMessage, timestamp: new Date() }]);
      setNewMessage('');
      scrollToBottom();
    } catch (err) { console.error(err); }
  };

  const selectChat = (contact) => {
    setActiveChat(contact);
    fetchMessages(contact.user_id);
  };

  const scrollToBottom = () => scrollRef.current?.scrollIntoView({ behavior: "smooth" });

  if (!user) return <div className="text-center mt-20">Please Login to Chat</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 h-[calc(100vh-100px)]">
       <div className="grid grid-cols-1 md:grid-cols-3 bg-white rounded-2xl shadow-xl overflow-hidden h-full border border-gray-200">
          
          {/* Sidebar */}
          <div className="md:col-span-1 border-r border-gray-100 flex flex-col">
             <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-bold text-lg text-gray-800">Messages</h2>
             </div>
             <div className="flex-1 overflow-y-auto">
                {contacts.length === 0 ? (
                    <p className="text-center text-gray-400 mt-10 text-sm">No conversations yet.</p>
                ) : (
                    contacts.map(c => (
                        <div 
                           key={c.user_id} 
                           onClick={() => selectChat(c)}
                           className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-green-50 transition ${activeChat?.user_id === c.user_id ? 'bg-green-50' : ''}`}
                        >
                           <img src={c.image || "https://via.placeholder.com/40"} className="w-10 h-10 rounded-full object-cover" alt=""/>
                           <div className="overflow-hidden">
                              <h4 className="font-bold text-sm text-gray-900">{c.name}</h4>
                              <p className="text-xs text-gray-500 truncate">{c.last_message}</p>
                           </div>
                        </div>
                    ))
                )}
             </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 flex flex-col bg-[#f8fafc]">
             {activeChat ? (
                <>
                  <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3 shadow-sm">
                     <img src={activeChat.image || "https://via.placeholder.com/40"} className="w-10 h-10 rounded-full object-cover" alt=""/>
                     <span className="font-bold text-gray-800">{activeChat.name}</span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                     {messages.map((msg, index) => {
                        const isMe = msg.sender_id === user.id;
                        return (
                           <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-green-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'}`}>
                                 {msg.content}
                              </div>
                           </div>
                        )
                     })}
                     <div ref={scrollRef}></div>
                  </div>

                  <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200 flex gap-2">
                     <input 
                       type="text" 
                       value={newMessage} 
                       onChange={(e) => setNewMessage(e.target.value)} 
                       placeholder="Type a message..." 
                       className="flex-1 bg-gray-100 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-green-500/20"
                     />
                     <button type="submit" className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition"><Send size={18} /></button>
                  </form>
                </>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                   <div className="bg-gray-100 p-6 rounded-full mb-4"><User size={40} /></div>
                   <p>Select a contact to start chatting</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default Chat;