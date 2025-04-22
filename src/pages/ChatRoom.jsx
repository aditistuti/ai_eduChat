import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { messageSent } from '../features/chat/chatSlice';
import { getSocket } from '../utils/socket';
import MessageBubble from '../components/MessageBubble';
import { Trash2 } from 'lucide-react';

const TypingIndicator = () => (
  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-full shadow-inner">
    <div className="text-sm font-medium text-gray-600">AI is typing</div>
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-150"></div>
      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-300"></div>
    </div>
  </div>
);

const predefinedQuestions = [
  { question: "What is AI?", answer: "AI stands for Artificial Intelligence, which involves machines performing tasks that require human intelligence." },
  { question: "What is the capital of France?", answer: "The capital of France is Paris." },
  { question: "Tell me a joke.", answer: "Why don't skeletons fight each other? They don't have the guts." },
];

const ChatRoom = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const messages = useSelector((state) => state.chat.messages);
  const endRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = {
      id: Date.now(),
      userId: 'user1',
      username: 'You',
      content: input,
      timestamp: new Date().toISOString(),
    };

    dispatch(messageSent(msg));
    getSocket().emit('chat-message', msg);
    setInput('');
    setTyping(true);

    // Simulate AI response after delay
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        userId: 'ai1',
        username: 'AI',
        content: selectedQuestion ? predefinedQuestions.find(q => q.question === selectedQuestion).answer : 'This is an AI response',
        timestamp: new Date().toISOString(),
      };
      dispatch(messageSent(aiMessage));
      setTyping(false);
    }, 2000);
  };

  // Handle clicking on predefined questions
  const handlePredefinedQuestion = (question) => {
    setSelectedQuestion(question);
    const msg = {
      id: Date.now(),
      userId: 'user1',
      username: 'You',
      content: question,
      timestamp: new Date().toISOString(),
    };
    dispatch(messageSent(msg));

    const aiMessage = {
      id: Date.now() + 1,
      userId: 'ai1',
      username: 'AI',
      content: predefinedQuestions.find(q => q.question === question).answer,
      timestamp: new Date().toISOString(),
    };
    dispatch(messageSent(aiMessage));
  };

  const clearChat = () => {
    dispatch({ type: 'chat/clearMessages' }); // Dispatch action to clear chat
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md h-[80vh] rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">AI‑Educational Chat</h2>
          <div className="text-sm">● Connected</div>
        </div>

        {/* Clear Chat Button */}
        <div className="top-1/2 -translate-y-1/2 right-4 align-items-right">
    <button
      onClick={clearChat}
      className="p-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition"
    >
      <Trash2 size={18} />
    </button>
  </div>
        {/* Predefined Questions */}
        <div className="p-4">
          {predefinedQuestions.map((item) => (
            <button
              key={item.question}
              onClick={() => handlePredefinedQuestion(item.question)}
              className="block w-full px-4 py-2 mb-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {item.question}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 px-4 py-3 overflow-y-auto space-y-2">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              username={msg.username}
              content={msg.content}
              isUser={msg.username === 'You'}
              timestamp={msg.timestamp}
            />
          ))}
          {typing && (
            <div className="pl-4">
              <TypingIndicator />
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t bg-white border-gray-200 flex space-x-2">
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              getSocket().emit('typing');
            }}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
