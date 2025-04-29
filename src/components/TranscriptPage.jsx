import React from 'react';
import jsPDF from 'jspdf';

const TranscriptPage = ({ onClose }) => {
  const transcriptWithTimecodes = [
    { time: "00:00", text: "Lorem ipsum dolor sit amet" },
    { time: "00:10", text: "Consectetur adipiscing elit" },
    { time: "00:20", text: "Sed do eiusmod tempor incididunt" },
    { time: "00:30", text: "Ut labore et dolore magna aliqua" },
  ];

  const handleDownload = () => {
    const doc = new jsPDF();
    const fullText = transcriptWithTimecodes.map(line => `[${line.time}] ${line.text}`).join("\n");
    doc.text(fullText, 10, 10);
    doc.save("transcript.pdf");
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white max-w-3xl w-full p-8 rounded-xl relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-black text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-3xl font-semibold mb-6">📄 Video Transcript</h2>
        <div className="w-full p-4 border border-gray-300 rounded-md mb-6 bg-white h-72 overflow-y-auto">
          {transcriptWithTimecodes.map((line, index) => (
            <p key={index} className="mb-3 text-base">
              <span className="text-orange-500 font-semibold mr-2">[{line.time}]</span>
              {line.text}
            </p>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
          <button
            onClick={handleDownload}
            className="w-full sm:w-1/2 px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-offset-2 active:scale-95 active:shadow-sm transition-all duration-300 ease-in-out flex items-center justify-center"
          >
            <span className="mr-2">⬇️</span> Download PDF
          </button>
          <button
            className="w-full sm:w-1/2 px-6 py-3 border border-gray-400 rounded-xl hover:bg-gray-100 text-lg flex items-center justify-center"
            onClick={() => navigator.clipboard.writeText(
              transcriptWithTimecodes.map(line => `[${line.time}] ${line.text}`).join("\n")
            )}
          >
            <span className="mr-2">📋</span> Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranscriptPage;
