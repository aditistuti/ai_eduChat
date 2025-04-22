import React from 'react';

const MessageBubble = ({ username, content, isUser, timestamp }) => {
  const timeString = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-[70%] shadow-md text-white ${
          isUser ? 'bg-blue-600' : 'bg-gray-700'
        }`}
      >
        {!isUser && <div className="text-xs text-gray-300 mb-1">{username}</div>}
        <div>{content}</div>
        <div className="text-right text-xs text-gray-300 mt-1">{timeString}</div>
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);
