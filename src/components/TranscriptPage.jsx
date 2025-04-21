import React, { useEffect, useState } from 'react';

const TranscriptPage = () => {
  const [transcript, setTranscript] = useState('');
  const [isTranscriptReady, setIsTranscriptReady] = useState(false);

  useEffect(() => {
    // Simulate checking if the transcript feature is ready
    const savedTranscript = localStorage.getItem('transcript');
    
    if (savedTranscript) {
      setTranscript(savedTranscript);
      setIsTranscriptReady(true);  // Set the feature as ready if transcript is found
    } else {
      setIsTranscriptReady(false);  // Keep it not ready until we have the feature
    }
  }, []);

  return (
    <section className="mt-16 w-full max-w-xl flex justify-center items-center">
      <div className="flex flex-col gap-4 text-center">
        {isTranscriptReady ? (
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
