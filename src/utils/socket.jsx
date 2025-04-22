import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io('https://backend-educhat.onrender.com'); 
  }
  // if (!socket) {
  //     socket = io('http://localhost:3001'); 
  // }
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
