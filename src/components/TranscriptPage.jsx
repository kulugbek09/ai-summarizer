import React, { useEffect, useState } from 'react';

const TranscriptPage = () => {
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [isTranscriptReady, setIsTranscriptReady] = useState(false);

  useEffect(() => {
    const savedTranscript = localStorage.getItem('transcript');
    const savedError = localStorage.getItem('error');

    if (savedError) {
      setError(savedError);
      setIsTranscriptReady(false);
    } else if (savedTranscript) {
      setTranscript(savedTranscript);
      setIsTranscriptReady(true);
    }
  }, []);

  return (
    <section className="mt-16 w-full max-w-xl flex justify-center items-center">
      <div className="flex flex-col gap-4 text-center">
        {error ? (
          // <p className="text-red-500 text-center">{error}</p>
          <p className="text-gray-500 text-lg">Coming Soon...</p>

        ) : isTranscriptReady ? (
          <>
            <h2 className="text-xl font-bold">Video Transcript</h2>
            <div className="summary_box">
              <p className="font-inter font-medium text-sm text-gray-300">{transcript}</p>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-lg">Coming Soon...</p>
        )}
      </div>
    </section>
  );
};

export default TranscriptPage;
