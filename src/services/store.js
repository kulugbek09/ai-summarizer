import { configureStore } from '@reduxjs/toolkit';
import youtubeReducer from './youtube';  // This is now correct

const store = configureStore({
  reducer: {
    youtube: youtubeReducer,  // This uses the default export from youtube.js
  },
});

export default store;