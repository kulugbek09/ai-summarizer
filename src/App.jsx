import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import YouTube from './components/YouTube';
import TranscriptPage from './components/TranscriptPage';
import SummarizePage from './components/SummarizePage';

import './App.css';

const App = () => {
  return (
    <Router>
      <main>
        <div className='main'>
          <div className='gradient' />
        </div>

        <div className='app'>
          <Routes>
            <Route path="/" element={<><Hero /><YouTube /></>} />
            <Route path="/transcript" element={<TranscriptPage />} />
            <Route path="/summarize" element={<SummarizePage />} />
          </Routes>

        </div>
      </main>
    </Router>
  );
};

export default App;
