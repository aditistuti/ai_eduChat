
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchInitialMessages = createAsyncThunk(
  'chat/fetchInitialMessages',
  async (_, thunkAPI) => {
    
    return []; 
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    typingUsers: [],
    connected: false,
    status: 'idle',  
    error: null,
  },
  reducers: {
    messageReceived(state, action) {
      state.messages.push(action.payload);
    },
    messageSent(state, action) {
      state.messages.push(action.payload);
    },
    setTypingUsers(state, action) {
      state.typingUsers = action.payload; 
    },
    connectionOpened(state) {
      state.connected = true;
      state.status = 'connected';
    },
    connectionClosed(state) {
      state.connected = false;
      state.status = 'idle';
    },
    connectionError(state, action) {
      state.connected = false;
      state.status = 'error';
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialMessages.pending, (state) => {
        state.status = 'connecting';
      })
      .addCase(fetchInitialMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.status = 'connected';
      })
      .addCase(fetchInitialMessages.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message;
      });
  },
});

export const {
  messageReceived,
  messageSent,
  setTypingUsers,
  connectionOpened,
  connectionClosed,
  connectionError,
} = chatSlice.actions;

export default chatSlice.reducer;
