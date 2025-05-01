import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';

const TranscriptPage = ({ onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [currentTime, setCurrentTime] = useState(null);
  const [animatedTranscript, setAnimatedTranscript] = useState([]);
  const transcriptRef = useRef(null);

  const transcriptWithTimecodes = [
    { time: "00:00", text: "Lorem ipsum dolor sit amet" },
    { time: "00:10", text: "Consectetur adipiscing elit" },
    { time: "00:20", text: "Sed do eiusmod tempor incididunt" },
    { time: "00:30", text: "Ut labore et dolore magna aliqua" },
  ];

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= transcriptWithTimecodes.length) {
        setAnimatedTranscript(transcriptWithTimecodes.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 300); // Adjust speed here

    return () => clearInterval(interval);
  }, []);

  const handleDownload = async (format) => {
    setIsDownloading(true);
    try {
      const fullText = transcriptWithTimecodes.map(line => `[${line.time}] ${line.text}`).join("\n");
      
      if (format === 'pdf') {
        const doc = new jsPDF();
        doc.text(fullText, 10, 10);
        doc.save("transcript.pdf");
      } else if (format === 'txt') {
        const blob = new Blob([fullText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transcript.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (format === 'docx') {
        // This is a placeholder - you would need a library like docx.js for actual DOCX generation
        alert('DOCX download will be implemented soon!');
      } else if (format === 'html') {
        const htmlContent = `
          <html>
            <head>
              <title>Video Transcript</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .time { color: #f97316; font-weight: bold; }
              </style>
            </head>
            <body>
              <h1>Video Transcript</h1>
              ${transcriptWithTimecodes.map(line => 
                `<p><span class="time">[${line.time}]</span> ${line.text}</p>`
              ).join('')}
            </body>
          </html>
        `;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transcript.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } finally {
      setIsDownloading(false);
      setShowDownloadOptions(false);
    }
  };

  const handleCopy = async () => {
    try {
      const fullText = transcriptWithTimecodes.map(line => `[${line.time}] ${line.text}`).join("\n");
      await navigator.clipboard.writeText(fullText);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const fullText = transcriptWithTimecodes.map(line => `[${line.time}] ${line.text}`).join("\n");
    printWindow.document.write(`
      <html>
        <head>
          <title>Video Transcript</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .title { font-size: 24px; margin-bottom: 20px; }
            .content { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <div class="title">Video Transcript</div>
          <div class="content">${fullText}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      const fullText = transcriptWithTimecodes.map(line => `${line.text}`).join(" ");
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      const fullText = transcriptWithTimecodes.map(line => `[${line.time}] ${line.text}`).join("\n");
      navigator.share({
        title: 'Video Transcript',
        text: fullText,
      }).catch(console.error);
    } else {
      setShowShareOptions(true);
    }
  };

  const handleTimeClick = (time) => {
    setCurrentTime(time);
    // Here you would typically seek the video to that timestamp
    // For now, we'll just highlight the clicked time
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center animate-fade-in">
      <div className="bg-white max-w-3xl w-full p-8 rounded-xl relative shadow-lg animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-black text-2xl font-bold transition-colors duration-200"
        >
          &times;
        </button>
        <h2 className="text-3xl font-semibold mb-6 flex items-center">
          <span className="mr-2">📄</span> Video Transcript
        </h2>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            {transcriptWithTimecodes.length} entries
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleTimeClick(null)}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
        <div 
          ref={transcriptRef}
          className="w-full p-6 border border-gray-200 rounded-xl mb-6 bg-gray-50 h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >
          {animatedTranscript.map((line, index) => (
            <p 
              key={index} 
              className={`mb-4 text-base leading-relaxed cursor-pointer transition-colors duration-200 ${
                currentTime === line.time ? 'bg-yellow-100 p-2 rounded' : ''
              }`}
              onClick={() => handleTimeClick(line.time)}
            >
              <span className="text-orange-500 font-semibold mr-2">[{line.time}]</span>
              {line.text}
            </p>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 justify-center items-center mt-4">
          <button
            onClick={() => setShowDownloadOptions(true)}
            disabled={isDownloading}
            className="px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-offset-2 active:scale-95 active:shadow-sm transition-all duration-300 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2">⬇️</span>
            Download
          </button>
          <button
            onClick={handleCopy}
            className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-lg flex items-center justify-center transition-all duration-300 ease-in-out"
          >
            <span className="mr-2">📋</span>
            {showCopySuccess ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-lg flex items-center justify-center transition-all duration-300 ease-in-out"
          >
            <span className="mr-2">🖨️</span>
            Print
          </button>
          <button
            onClick={handleReadAloud}
            className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-lg flex items-center justify-center transition-all duration-300 ease-in-out"
          >
            <span className="mr-2">🔊</span>
            Read Aloud
          </button>
          <button
            onClick={handleShare}
            className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-lg flex items-center justify-center transition-all duration-300 ease-in-out"
          >
            <span className="mr-2">📤</span>
            Share
          </button>
        </div>
        {showShareOptions && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Share via</h3>
            <div className="flex gap-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  transcriptWithTimecodes.map(line => `[${line.time}] ${line.text}`).join("\n")
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600"
              >
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(
                  transcriptWithTimecodes.map(line => `[${line.time}] ${line.text}`).join("\n")
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900"
              >
                LinkedIn
              </a>
              <a
                href={`mailto:?subject=Video Transcript&body=${encodeURIComponent(
                  transcriptWithTimecodes.map(line => `[${line.time}] ${line.text}`).join("\n")
                )}`}
                className="text-gray-600 hover:text-gray-800"
              >
                Email
              </a>
            </div>
          </div>
        )}
        {showDownloadOptions && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center animate-fade-in">
            <div className="bg-white p-8 rounded-xl shadow-lg animate-slide-up max-w-md w-full">
              <h3 className="text-2xl font-semibold mb-6">Choose Download Format</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleDownload('pdf')}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 flex flex-col items-center transition-all duration-300"
                >
                  <span className="text-3xl mb-2">📄</span>
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => handleDownload('txt')}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 flex flex-col items-center transition-all duration-300"
                >
                  <span className="text-3xl mb-2">📝</span>
                  <span>TXT</span>
                </button>
                <button
                  onClick={() => handleDownload('docx')}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 flex flex-col items-center transition-all duration-300"
                >
                  <span className="text-3xl mb-2">📑</span>
                  <span>DOCX</span>
                </button>
                <button
                  onClick={() => handleDownload('html')}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 flex flex-col items-center transition-all duration-300"
                >
                  <span className="text-3xl mb-2">🌐</span>
                  <span>HTML</span>
                </button>
              </div>
              <button
                onClick={() => setShowDownloadOptions(false)}
                className="mt-6 w-full py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptPage;
