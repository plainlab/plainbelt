/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import { clipboard } from 'electron';

const RegexTester = () => {
  const [search, setSearch] = useState('plai*');
  const [input, setInput] = useState(
    'PlainBelt - A toolbel for your plain text'
  );
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChangeSearch = (evt: { target: { value: string } }) =>
    setSearch(evt.target.value);

  const handleChangeInput = (evt: { target: { value: string } }) =>
    setInput(evt.target.value);

  const handleClipboardInput = () => {
    setInput(clipboard.readText());
  };

  const handleClipboardSearch = () => {
    setSearch(clipboard.readText());
  };

  const handleCopySearch = () => {
    setCopied(true);
    clipboard.write({ text: search });
    setTimeout(() => setCopied(false), 500);
  };

  useEffect(() => {
    const regex = new RegExp(search, 'gi');
    const out = input.replace(
      regex,
      (str: string) => `<span class='text-blue-500'>${str}</span>`
    );
    setOutput(out);
  }, [search, input]);

  return (
    <div className="flex flex-col h-full">
      <section className="flex flex-col flex-1 w-full h-full space-y-2">
        <section className="flex flex-col">
          <div className="flex justify-between mb-1">
            <span className="flex space-x-2">
              <button
                type="button"
                className="btn"
                onClick={handleClipboardSearch}
              >
                Clipboard
              </button>
            </span>
            <span className="flex space-x-2">
              <button
                type="button"
                className="btn"
                onClick={handleCopySearch}
                disabled={copied}
              >
                Copy
              </button>
            </span>
          </div>
          <textarea
            onChange={handleChangeSearch}
            className="flex-1 p-4 bg-white rounded-md"
            value={search}
          />
        </section>

        <section className="flex flex-col flex-1 h-1/3">
          <div className="flex justify-between mb-1">
            <span className="flex space-x-2">
              <button
                type="button"
                className="btn"
                onClick={handleClipboardInput}
              >
                Clipboard
              </button>
            </span>
          </div>
          <textarea
            onChange={handleChangeInput}
            className="flex-1 p-4 bg-white rounded-md"
            value={input}
          />
        </section>

        <section className="flex flex-col flex-1 h-1/3">
          <div className="flex justify-end mb-1">
            <span className="flex space-x-2">3 matches</span>
          </div>
          <section
            className="flex-1 w-full p-4 whitespace-pre bg-gray-100 rounded-md"
            dangerouslySetInnerHTML={{ __html: output }}
          />
        </section>
      </section>
    </div>
  );
};

export default RegexTester;
