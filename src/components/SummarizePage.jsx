import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';

const SummarizePage = ({ onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const textareaRef = useRef(null);

  const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac justo vitae orci tristique luctus. Mauris tempor nisl sed risus hendrerit, vel pharetra lacus sollicitudin. Nunc vitae justo nec nisi sagittis commodo.`;

  useEffect(() => {
    let currentIndex = 0;
    const typingSpeed = 30; // Adjust typing speed (lower = faster)
    const pauseDuration = 1000; // Pause at the end

    const typeText = () => {
      if (currentIndex < lorem.length) {
        setDisplayedText(prev => prev + lorem[currentIndex]);
        currentIndex++;
        setTimeout(typeText, typingSpeed);
      } else {
        setTimeout(() => {
          setIsTyping(false);
        }, pauseDuration);
      }
    };

    typeText();

    return () => {
      setIsTyping(false);
    };
  }, []);

  const handleDownload = async (format) => {
    setIsDownloading(true);
    try {
      if (format === 'pdf') {
        const doc = new jsPDF();
        doc.text(lorem, 10, 10);
        doc.save("summary.pdf");
      } else if (format === 'txt') {
        const blob = new Blob([lorem], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'summary.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (format === 'docx') {
        alert('DOCX download will be implemented soon!');
      } else if (format === 'html') {
        const blob = new Blob([`<html><body><h1>Video Summary</h1><p>${lorem}</p></body></html>`], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'summary.html';
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
      await navigator.clipboard.writeText(lorem);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Video Summary</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .title { font-size: 24px; margin-bottom: 20px; }
            .content { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <div class="title">Video Summary</div>
          <div class="content">${lorem}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(lorem);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Video Summary',
        text: lorem,
      }).catch(console.error);
    } else {
      setShowShareOptions(true);
    }
  };

  const highlightImportantPoints = () => {
    const sentences = lorem.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const importantSentences = sentences.filter(s => s.split(' ').length > 5);
    
    let highlightedText = lorem;
    importantSentences.forEach(sentence => {
      highlightedText = highlightedText.replace(
        sentence.trim(),
        `<span class="bg-yellow-200">${sentence.trim()}</span>`
      );
    });

    if (textareaRef.current) {
      textareaRef.current.innerHTML = highlightedText;
    }
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
          <span className="mr-2">🧠</span> Video Summary
        </h2>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            {lorem.length} characters
          </span>
          <button
            onClick={highlightImportantPoints}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Highlight Important Points
          </button>
        </div>
        <div className="w-full p-6 border border-gray-200 rounded-xl mb-6 bg-gray-50">
          <div className="text-base leading-relaxed whitespace-pre-wrap">
            {displayedText}
            {isTyping && (
              <span className="inline-block w-2 h-5 bg-gray-800 animate-blink" />
            )}
          </div>
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
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(lorem)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600"
              >
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(lorem)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900"
              >
                LinkedIn
              </a>
              <a
                href={`mailto:?subject=Video Summary&body=${encodeURIComponent(lorem)}`}
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

export default SummarizePage;
