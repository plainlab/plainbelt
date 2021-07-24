import React, { useEffect, useState } from 'react';
import { ipcRenderer, clipboard } from 'electron';

const Base64 = () => {
  const [input, setInput] = useState('Raw data');
  const [encode, setEncode] = useState(true);
  const [string, setString] = useState(true);
  const [output, setOutput] = useState(btoa('Raw data'));
  const [opening, setOpening] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChangeInput = (evt: { target: { value: string } }) =>
    setInput(evt.target.value);

  const handleOpenInput = async () => {
    setOpening(true);
    const content = await ipcRenderer.invoke('open-file', []);
    if (string) {
      setInput(Buffer.from(content).toString());
    } else {
      setInput(content);
    }
    setOpening(false);
  };

  const handleClipboardInput = () => {
    setInput(clipboard.readText());
  };

  const handleCopyOutput = () => {
    setCopied(true);
    clipboard.write({ text: output });
    setTimeout(() => setCopied(false), 500);
  };

  useEffect(() => {
    try {
      if (encode) {
        setOutput(Buffer.from(input).toString('base64'));
      } else {
        setOutput(Buffer.from(input, 'base64').toString());
      }
    } catch (e) {
      setOutput(e.message);
    }
  }, [input, encode]);

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex justify-between mb-1">
        <span className="flex space-x-2">
          <button type="button" className="btn" onClick={handleClipboardInput}>
            Clipboard
          </button>
          <button
            type="button"
            className="btn"
            onClick={handleOpenInput}
            disabled={opening}
          >
            Open...
          </button>
          <div className="flex space-x-2 items-center">
            <label htmlFor="string" className="flex items-center space-x-1">
              <input
                type="radio"
                className="btn"
                name="string"
                id="string"
                checked={string}
                onChange={() => setString(true)}
              />
              <p>Text</p>
            </label>
            <label htmlFor="raw" className="flex items-center space-x-1">
              <input
                type="radio"
                className="btn"
                name="string"
                id="raw"
                checked={!string}
                onChange={() => setString(false)}
              />
              <p>Binary</p>
            </label>
          </div>
        </span>
        <span className="flex space-x-4">
          <div className="flex space-x-4 items-center">
            <label htmlFor="encoder" className="flex items-center space-x-1">
              <input
                type="radio"
                className="btn"
                name="encode"
                id="encoder"
                checked={encode}
                onChange={() => setEncode(true)}
              />
              <p>Encode</p>
            </label>
            <label htmlFor="decoder" className="flex items-center space-x-1">
              <input
                type="radio"
                className="btn"
                name="encode"
                id="decoder"
                checked={!encode}
                onChange={() => setEncode(false)}
              />
              <p>Decode</p>
            </label>
          </div>
          <button
            type="button"
            className="btn"
            onClick={handleCopyOutput}
            disabled={copied}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </span>
      </div>
      <div className="flex min-h-full flex-1">
        <textarea
          onChange={handleChangeInput}
          className="flex-1 min-h-full bg-white p-4 rounded-md"
          value={input}
          disabled={opening}
        />
        <div className="mx-1" />
        <textarea
          className="flex-1 min-h-full bg-blue-100 p-4 rounded-md"
          value={output}
          readOnly
        />
      </div>
    </div>
  );
};

export default Base64;
