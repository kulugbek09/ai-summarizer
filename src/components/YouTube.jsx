import React, { useState } from 'react';
import { getTranscript } from '../services/youtube';
import { loader } from '../assets';
import SummarizePage from './SummarizePage';
import TranscriptPage from './TranscriptPage';

const YouTube = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activePopup, setActivePopup] = useState(null);

  const handleButtonClick = async (action) => {
    if (!youtubeUrl) return;

    setIsLoading(true);

    try {
      const fetchedTranscript = await getTranscript(youtubeUrl);
      if (!fetchedTranscript) throw new Error('No transcript found.');

      localStorage.setItem('transcript', fetchedTranscript);
      localStorage.setItem('videoUrl', youtubeUrl);
      localStorage.removeItem('error');
    } catch (err) {
      localStorage.setItem('error', err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
      setActivePopup(action);
    }
  };

  const closePopup = () => setActivePopup(null);

  return (
    <section className="mt-16 w-full max-w-xl px-4 sm:px-0 relative">
      <div className="flex flex-col w-full gap-4">
        <div className="relative flex justify-center items-center">
          <input
            type="url"
            placeholder="Paste YouTube video URL here"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            required
            className="url_input w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full">
          <button
            type="button"
            onClick={() => handleButtonClick('transcript')}
            className="w-full sm:w-1/2 px-4 py-3 rounded-xl bg-black text-white font-semibold 
              hover:bg-gray-800 hover:shadow-xl 
              focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-offset-2 
              active:scale-95 active:shadow-sm
              transition-all duration-300 ease-in-out"
          >
            📄 Get Transcript
          </button>

          <button
            type="button"
            onClick={() => handleButtonClick('summarize')}
            className="w-full sm:w-1/2 px-4 py-3 rounded-xl bg-black text-white font-semibold 
              hover:bg-gray-800 hover:shadow-xl 
              focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-offset-2 
              active:scale-95 active:shadow-sm
              transition-all duration-300 ease-in-out"
          >
            🧠 Summarize
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center mt-6">
          <img src={loader} alt="loader" className="w-10 h-10 object-contain animate-spin" />
        </div>
      )}

      {activePopup === 'transcript' && <TranscriptPage onClose={closePopup} />}
      {activePopup === 'summarize' && <SummarizePage onClose={closePopup} />}
    </section>
  );
};

export default YouTube;