import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { clipboard } from 'electron';

import relativeTime from 'dayjs/plugin/relativeTime';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import weekday from 'dayjs/plugin/weekday';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.extend(relativeTime);
dayjs.extend(dayOfYear);
dayjs.extend(weekOfYear);
dayjs.extend(isLeapYear);
dayjs.extend(weekday);
dayjs.extend(buddhistEra);

const UnixTimestampConverter = () => {
  const [date, setDate] = useState(dayjs());
  const [copied, setCopied] = useState(false);

  const [epoch, setEpoch] = useState(dayjs().unix());
  const [dateStr, setDateStr] = useState(dayjs().toISOString());

  useEffect(() => {
    const timerID = setInterval(() => setDate(dayjs()), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  const handleClipboard = () => {
    const cl = parseInt(clipboard.readText(), 10) || dayjs().unix();
    setEpoch(cl);
  };

  const handleCopy = () => {
    clipboard.write({ text: `${date.unix()}` });
    setCopied(true);
    setTimeout(() => setCopied(false), 1_000);
  };

  const handleChangeEpoch = (evt: { target: { value: string } }) => {
    const val = parseInt(evt.target.value, 10) || 0;
    setEpoch(val);
  };

  const handleChangeDate = (evt: { target: { value: string } }) => {
    const val = evt.target.value;
    setDateStr(val);
  };

  const handleConvertFromDate = () => {
    if (dayjs(dateStr).isValid()) {
      setEpoch(dayjs(dateStr).unix());
    }
  };

  useEffect(() => {
    setDateStr(dayjs.unix(epoch).toISOString());
  }, [epoch]);

  return (
    <div className="min-h-full flex flex-col">
      <section className="flex justify-start space-x-2 mb-4">
        <button type="button" className="btn" onClick={handleClipboard}>
          Clipboard
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => setEpoch(dayjs().unix())}
        >
          Now
        </button>
        <button type="button" className="btn" onClick={() => setEpoch(0)}>
          Epoch
        </button>
      </section>

      <section className="flex items-center justify-between space-x-4 mb-4 pb-4">
        <label htmlFor="epoch" className="flex-1">
          <span>Unix timestamp:</span>
          <input
            value={epoch}
            onChange={handleChangeEpoch}
            type="number"
            id="epoch"
            className="flex w-full p-1 rounded"
          />
        </label>
        <label htmlFor="iso" className="flex-1">
          <span>ISO date:</span>
          <input
            value={dateStr}
            onChange={handleChangeDate}
            onBlur={handleConvertFromDate}
            type="text"
            id="iso"
            className="flex w-full p-1 rounded"
          />
        </label>
      </section>

      <section className="flex flex-col space-y-4 w-full p-4 pb-8 rounded-md bg-gray-200 border mb-4">
        <section className="flex items-center justify-between space-x-4">
          <label htmlFor="local" className="flex-1">
            <span>Local:</span>
            <input
              value={dayjs.unix(epoch).toDate().toLocaleString()}
              type="text"
              id="local"
              className="flex w-full p-1 rounded"
              readOnly
            />
          </label>
          <label htmlFor="rel" className="flex-1">
            <span>Relative:</span>
            <input
              value={dayjs.unix(epoch).fromNow()}
              type="text"
              id="rel"
              className="flex w-full p-1 rounded"
              readOnly
            />
          </label>
        </section>
        <section className="flex items-center justify-between space-x-4">
          <label htmlFor="dayyear" className="flex-1">
            <span>Day of year:</span>
            <input
              value={dayjs.unix(epoch).dayOfYear()}
              type="text"
              id="dayyear"
              className="flex w-full p-1 rounded"
              readOnly
            />
          </label>
          <label htmlFor="weekyear" className="flex-1">
            <span>Week of year:</span>
            <input
              value={dayjs.unix(epoch).week()}
              type="text"
              id="weekyear"
              className="flex w-full p-1 rounded"
              readOnly
            />
          </label>
        </section>
        <section className="flex items-center justify-between space-x-4">
          <label htmlFor="leap" className="flex-1">
            <span>Is leap year:</span>
            <input
              value={`${dayjs.unix(epoch).isLeapYear()}`}
              type="text"
              id="leap"
              className="flex w-full p-1 rounded"
              readOnly
            />
          </label>
          <label htmlFor="be" className="flex-1">
            <span> Buddhist Era (B.E.):</span>
            <input
              value={dayjs.unix(epoch).format('BBBB')}
              type="text"
              id="be"
              className="flex w-full p-1 rounded"
              readOnly
            />
          </label>
        </section>
      </section>
      <section className="mt-4 pt-4 space-y-1 flex items-center border-t space-x-2 pb-4">
        <p>The current Unix epoch time is</p>
        <span className="bg-blue-200 px-2 py-0.5 rounded font-mono">
          {date.unix()}
        </span>
        <button
          type="button"
          className="btn"
          onClick={handleCopy}
          disabled={copied}
        >
          Copy
        </button>
      </section>
    </div>
  );
};

export default UnixTimestampConverter;
