import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { messageSent } from '../features/chat/chatSlice';
import { getSocket } from '../utils/socket';
import MessageBubble from '../components/MessageBubble';


const TypingIndicator = () => (
  <div className="flex items-center space-x-1 px-4 py-2 bg-gray-700 text-white w-fit rounded-lg shadow">
    <span>AI</span>
    <div className="flex space-x-1 ml-2">
      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
    </div>
  </div>
);

function ChatRoom() {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const messages = useSelector((state) => state.chat.messages);
  const messageEndRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    const socket = getSocket();
    const msg = {
      id: Date.now(),
      userId: 'user1',
      username: 'You',
      content: input,
      timestamp: new Date().toISOString(),
    };

    dispatch(messageSent(msg)); 
    socket.emit('chat-message', msg); 
    setInput('');
    setTyping(true);


    setTimeout(() => {
      const aiMessage = {
        id: Date.now(),
        userId: 'ai1',
        username: 'AI',
        content: "This is an AI response",
        timestamp: new Date().toISOString(),
      };
      dispatch(messageSent(aiMessage)); 
      setTyping(false);
    }, 2000); 
  };

 
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  

  return (
    <div className="max-w-2xl mx-auto border border-gray-200 rounded-lg shadow-lg p-4 flex flex-col h-[80vh] bg-white ">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto pr-2 mb-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            username={msg.username}
            content={msg.content}
            isUser={msg.username === 'You'}
            timestamp={msg.timestamp}
          />
        ))}
        
        {/* Scroll to the latest message */}
        <div ref={messageEndRef} />
        
        {/* Show Typing Indicator when AI is typing */}
        {typing && (
          <div className="mb-4">
            <TypingIndicator />
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2 flex flex-col sm:flex-row sm:space-x-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm sm:text-base md:text-lg px-4 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
