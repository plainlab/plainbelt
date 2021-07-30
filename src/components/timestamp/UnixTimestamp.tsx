import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { clipboard } from 'electron';

import relativeTime from 'dayjs/plugin/relativeTime';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import weekday from 'dayjs/plugin/weekday';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import { useLocation } from 'react-router-dom';

dayjs.extend(relativeTime);
dayjs.extend(dayOfYear);
dayjs.extend(weekOfYear);
dayjs.extend(isLeapYear);
dayjs.extend(weekday);
dayjs.extend(buddhistEra);

interface LocationState {
  input1: number;
}

const UnixTimestampConverter = () => {
  const location = useLocation<LocationState>();
  const [date, setDate] = useState(dayjs());
  const [copied, setCopied] = useState(false);

  const [epoch, setEpoch] = useState(dayjs().unix());
  const [dateStr, setDateStr] = useState(dayjs().toISOString());

  useEffect(() => {
    const timerID = setInterval(() => setDate(dayjs()), 1000);

    return () => {
      clearInterval(timerID);
    };
  });

  useEffect(() => {
    if (location.state) {
      const { input1 } = location.state;
      if (input1) {
        setEpoch(input1);
      }
    }
  }, [location]);

  const handleClipboard = () => {
    const cl = parseInt(clipboard.readText(), 10) || dayjs().unix();
    setEpoch(cl);
  };

  const handleCopy = () => {
    clipboard.write({ text: `${date.unix()}` });
    setCopied(true);
    setTimeout(() => setCopied(false), 500);
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
    <div className="flex flex-col min-h-full space-y-4">
      <section className="flex justify-start space-x-2">
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

      <section className="flex items-center justify-between pb-4 space-x-4">
        <label htmlFor="epoch" className="flex-1">
          <p className="mb-1">Unix timestamp:</p>
          <input
            value={epoch}
            onChange={handleChangeEpoch}
            type="number"
            id="epoch"
            className="flex w-full px-2 py-1"
          />
        </label>
        <label htmlFor="iso" className="flex-1">
          <p className="mb-1">ISO date:</p>
          <input
            value={dateStr}
            onChange={handleChangeDate}
            onBlur={handleConvertFromDate}
            type="text"
            id="iso"
            className="flex w-full px-2 py-1 rounded"
          />
        </label>
      </section>

      <section className="flex flex-col w-full p-2 pb-4 space-y-4 bg-gray-100 border rounded-md shadow-sm">
        <section className="flex items-center justify-between space-x-4">
          <label htmlFor="local" className="flex-1">
            <p className="mb-1">Local:</p>
            <input
              value={dayjs.unix(epoch).toDate().toLocaleString()}
              type="text"
              id="local"
              className="flex w-full px-2 py-1 rounded"
              readOnly
            />
          </label>
          <label htmlFor="rel" className="flex-1">
            <p className="mb-1">Relative:</p>
            <input
              value={dayjs.unix(epoch).from(date)}
              type="text"
              id="rel"
              className="flex w-full px-2 py-1 rounded"
              readOnly
            />
          </label>
        </section>
        <section className="flex items-center justify-between space-x-4">
          <label htmlFor="dayyear" className="flex-1">
            <p className="mb-1">Day of year:</p>
            <input
              value={dayjs.unix(epoch).dayOfYear()}
              type="text"
              id="dayyear"
              className="flex w-full px-2 py-1 rounded"
              readOnly
            />
          </label>
          <label htmlFor="weekyear" className="flex-1">
            <p className="mb-1">Week of year:</p>
            <input
              value={dayjs.unix(epoch).week()}
              type="text"
              id="weekyear"
              className="flex w-full px-2 py-1 rounded"
              readOnly
            />
          </label>
        </section>
        <section className="flex items-center justify-between space-x-4">
          <label htmlFor="leap" className="flex-1">
            <p className="mb-1">Is leap year:</p>
            <input
              value={`${dayjs.unix(epoch).isLeapYear()}`}
              type="text"
              id="leap"
              className="flex w-full px-2 py-1 rounded"
              readOnly
            />
          </label>
          <label htmlFor="be" className="flex-1">
            <p className="mb-1">Buddhist Era (B.E.):</p>
            <input
              value={dayjs.unix(epoch).format('BBBB')}
              type="text"
              id="be"
              className="flex w-full px-2 py-1 rounded"
              readOnly
            />
          </label>
        </section>
      </section>
      <section className="flex items-center pt-4 pb-4 space-x-2 space-y-1">
        <p>The current Unix epoch time is</p>
        <p className="bg-gray-100 border shadow-sm px-2 py-0.5 rounded-md font-mono">
          {date.unix()}
        </p>
        <button
          type="button"
          className="w-16 btn"
          onClick={handleCopy}
          disabled={copied}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </section>
    </div>
  );
};

export default UnixTimestampConverter;
