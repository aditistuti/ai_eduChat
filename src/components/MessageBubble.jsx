import React from 'react';

const MessageBubble = ({ username, content, isUser, timestamp }) => {
  const timeString = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="mr-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white uppercase">
            {username.charAt(0)}
          </div>
        </div>
      )}

      <div className="relative px-4 py-2 rounded-2xl shadow max-w-[70%] bg-gray-100 text-gray-800">
        {!isUser && <div className="font-semibold mb-1">{username}</div>}
        <div className="whitespace-pre-wrap">{content}</div>
        <div className="text-xs mt-1 opacity-70 text-right">{timeString}</div>
      </div>

      {isUser && (
        <div className="ml-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            You
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(MessageBubble);
