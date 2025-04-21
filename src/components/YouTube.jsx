import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Correct hook to navigate
import { getTranscript } from '../services/youtube';
import { loader } from '../assets';

const YouTube = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook to navigate between pages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Reset error on submit

    try {
      // Fetch the transcript from the backend
      const fetchedTranscript = await getTranscript(youtubeUrl);
      if (!fetchedTranscript) throw new Error('No transcript found');

      // Store transcript in localStorage for access on the next page
      localStorage.setItem('transcript', fetchedTranscript);

      // Navigate to the /transcript page to display the transcript
      navigate('/transcript');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="url"
            placeholder="Paste YouTube video URL here"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            ↵
          </button>
        </form>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex justify-center items-center">
          <img src={loader} alt="loader" className="w-10 h-10 object-contain" />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-center">{error}</p>
      )}
    </section>
  );
};

export default YouTube;
