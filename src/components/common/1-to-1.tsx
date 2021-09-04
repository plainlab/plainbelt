import { clipboard } from 'electron';
import React, { useState } from 'react';

interface OneToOneProps {
  fromDefault: string;
  fromFunc: (f: string) => string;
  inverseFunc: (r: string) => string;
}

const OneToOne = ({ fromDefault, fromFunc, inverseFunc }: OneToOneProps) => {
  const [from, setFrom] = useState(fromDefault);
  const [to, setTo] = useState(fromFunc(from));

  const [fromCopied, setFromCopied] = useState(false);
  const [toCopied, setToCopied] = useState(false);

  const changeFrom = (value: string) => {
    setFrom(value);
    setTo(fromFunc(value));
  };

  const changeTo = (value: string) => {
    setTo(value);
    setFrom(inverseFunc(value));
  };

  const handleChangeFrom = (evt: { target: { value: string } }) =>
    changeFrom(evt.target.value);

  const handleChangeTo = (evt: { target: { value: string } }) =>
    changeTo(evt.target.value);

  const handleCopyFrom = () => {
    setFromCopied(true);
    clipboard.write({ text: from });
    setTimeout(() => setFromCopied(false), 500);
  };

  const handleCopyTo = () => {
    setToCopied(true);
    clipboard.write({ text: to });
    setTimeout(() => setToCopied(false), 500);
  };

  const handleClipboardFrom = () => {
    changeFrom(clipboard.readText());
  };

  const handleClipboardTo = () => {
    changeTo(clipboard.readText());
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex justify-between mb-1">
        <section className="flex items-center justify-start space-x-2">
          <button type="button" className="btn" onClick={handleClipboardFrom}>
            Clipboard
          </button>
          <button
            type="button"
            className="w-16 btn"
            onClick={handleCopyFrom}
            disabled={fromCopied}
          >
            {fromCopied ? 'Copied' : 'Copy'}
          </button>
        </section>
        <section className="flex items-center justify-start space-x-2">
          <button type="button" className="btn" onClick={handleClipboardTo}>
            Clipboard
          </button>
          <button
            type="button"
            className="w-16 btn"
            onClick={handleCopyTo}
            disabled={toCopied}
          >
            {toCopied ? 'Copied' : 'Copy'}
          </button>
        </section>
      </div>
      <div className="flex flex-1 min-h-full space-x-2">
        <textarea
          onChange={handleChangeFrom}
          className="flex-1 min-h-full p-2 bg-white rounded-md"
          value={from}
        />
        <textarea
          onChange={handleChangeTo}
          className="flex-1 min-h-full p-2 bg-white rounded-md"
          value={to}
        />
      </div>
    </div>
  );
};

export default OneToOne;
