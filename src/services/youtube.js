import { createSlice } from '@reduxjs/toolkit';

// Example slice to manage YouTube data
const youtubeSlice = createSlice({
  name: 'youtube',
  initialState: {
    transcript: '',
  },
  reducers: {
    setTranscript(state, action) {
      state.transcript = action.payload;
    },
  },
});

export const { setTranscript } = youtubeSlice.actions;

// Export the reducer to be used in the store
export default youtubeSlice.reducer;

// Your getTranscript function for making API calls
import axios from 'axios';

const BASE_URL = 'https://your-backend-url.com'; // Or local backend

export const getTranscript = async (videoUrl) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/transcript`, {
      params: { url: videoUrl },
    });

    return response.data.transcript;
  } catch (error) {
    console.error("Error fetching YouTube transcript:", error);
    return null;
  }
};
