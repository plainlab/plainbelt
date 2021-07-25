/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import { clipboard } from 'electron';

const RegexTester = () => {
  const [search, setSearch] = useState('plai*');
  const [flag, setFlag] = useState('gi');
  const [input, setInput] = useState(
    'PlainBelt - A toolbelt for your plain text'
  );
  const [output, setOutput] = useState('');
  const [match, setMatch] = useState(0);

  const handleChangeSearch = (evt: { target: { value: string } }) =>
    setSearch(evt.target.value);

  const handleChangeFlag = (evt: { target: { value: string } }) =>
    setFlag(evt.target.value);

  const handleChangeInput = (evt: { target: { value: string } }) =>
    setInput(evt.target.value);

  const handleClipboardInput = () => {
    setInput(clipboard.readText());
  };

  const handleClipboardSearch = () => {
    setSearch(clipboard.readText());
  };

  useEffect(() => {
    try {
      const regex = new RegExp(search, flag);
      const out = input.replace(
        regex,
        (str: string) => `<span class='text-blue-500'>${str}</span>`
      );
      setMatch(input.match(regex)?.length || 0);
      setOutput(out);
    } catch (e) {
      setOutput(e.message);
    }
  }, [search, input, flag]);

  return (
    <div className="flex flex-col h-full">
      <section className="flex flex-col flex-1 w-full h-full space-y-4">
        <section className="flex flex-col">
          <div className="flex justify-between mb-1">
            <button
              type="button"
              className="btn"
              onClick={handleClipboardSearch}
            >
              Clipboard
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              onChange={handleChangeSearch}
              className="flex-1 px-2 py-1 bg-white rounded-md"
              value={search}
            />
            <input
              onChange={handleChangeFlag}
              className="w-1/12 px-2 py-1 bg-white rounded-md"
              value={flag}
            />
          </div>
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
          <div className="flex justify-between mb-1">
            <div className="flex items-center my-1 space-x-1">
              <span>Search for:</span>
              <span className="font-mono text-gray-400">
                /<span className="text-gray-700">{search}</span>/{flag}
              </span>
            </div>
            <span className="flex space-x-2">
              {match} match{match === 1 ? '' : 'es'}
            </span>
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
