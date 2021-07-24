import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { clipboard } from 'electron';

const UnixTimestampConverter = () => {
  const [date, setDate] = useState(dayjs());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timerID = setInterval(() => setDate(dayjs()), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  const handleCopy = () => {
    clipboard.write({ text: `${date.unix()}` });
    setCopied(true);
    setTimeout(() => setCopied(false), 1_000);
  };

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex justify-start mb-1">
        <button
          type="button"
          className="btn"
          onClick={handleCopy}
          disabled={copied}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="flex-1 min-h-full">
        The current Unix epoch time is
        <span className="text-base bg-blue-200 mx-2 px-2 py-1 rounded inline-flex items-center content-center font-mono">
          {date.unix()}
        </span>
      </div>
    </div>
  );
};

export default UnixTimestampConverter;
