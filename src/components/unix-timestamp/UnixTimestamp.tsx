import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

const UnixTimestampConverter = () => {
  const [date, setDate] = useState(dayjs());

  useEffect(() => {
    const timerID = setInterval(() => setDate(dayjs()), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  return (
    <div>
      The current Unix epoch time is
      <span className="text-lg bg-blue-200 mx-2 p-2 rounded inline-flex items-center content-center">
        {date.unix()}
      </span>
    </div>
  );
};

export default UnixTimestampConverter;
