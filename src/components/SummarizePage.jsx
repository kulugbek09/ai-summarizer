import React, { useEffect, useState } from 'react';

const SummarizePage = () => {
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');
    const [isSummaryReady, setIsSummaryReady] = useState(false);

    useEffect(() => {
        const savedError = localStorage.getItem('error');
        const savedTranscript = localStorage.getItem('transcript');

        if (savedError) {
            setError(savedError);
            setIsSummaryReady(false);
        } else if (savedTranscript) {
            // Fake summarize for now: truncate or manipulate
            const fakeSummary = `Summary:\n\n${savedTranscript
                .split(' ')
                .slice(0, 50)
                .join(' ')}...`;

            setSummary(fakeSummary);
            setIsSummaryReady(true);
        }
    }, []);

    return (
        <section className="mt-16 w-full max-w-xl flex justify-center items-center">
            <div className="flex flex-col gap-4 text-center">
                {error ? (
                    // <p className="text-red-500 text-center">{error}</p>
                    <p className="text-gray-500 text-lg">Coming Soon...</p>

                ) : isSummaryReady ? (
                    <>
                        <h2 className="text-xl font-bold">Summary</h2>
                        <div className="summary_box">
                            <p className="font-inter font-medium text-sm text-gray-300 whitespace-pre-wrap">
                                {summary}
                            </p>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 text-lg">Coming Soon...</p>
                )}
            </div>
        </section>
    );
};

export default SummarizePage;
