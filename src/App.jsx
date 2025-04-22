import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  connectionOpened,
  connectionClosed,
  connectionError,
  messageReceived,
} from './features/chat/chatSlice';
import { connectSocket, getSocket, disconnectSocket } from './utils/socket';
import ChatRoom from './pages/ChatRoom';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    connectSocket();
    const socket = getSocket();
    
    socket.on('typing', () => {
      dispatch(setTypingUsers(['AI']));
    });
    

    socket.on('connect', () => {
      dispatch(connectionOpened());
      console.log('🟢 Connected to socket');
    });

    socket.on('disconnect', () => {
      dispatch(connectionClosed());
      console.log('🔴 Disconnected');
    });

    socket.on('connect_error', (err) => {
      dispatch(connectionError(err.message));
    });

    socket.on('chat-message', (msg) => {
      dispatch(messageReceived(msg));
    });

    return () => {
      disconnectSocket();
    };
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-4">AI Chat App</h1>
      <ChatRoom />
    </div>
  );
}

export default App;
