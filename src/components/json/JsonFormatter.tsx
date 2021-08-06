import React, { useEffect, useState } from 'react';
import { ipcRenderer, clipboard } from 'electron';
import { useLocation } from 'react-router-dom';

interface LocationState {
  input1: string;
}

const JsonFormatter = () => {
  const location = useLocation<LocationState>();

  const [input, setInput] = useState(
    '{"name":"PlainBelt","url":"https://github.com/plainlab/plainbelt"}'
  );
  const [output, setOutput] = useState('');
  const [opening, setOpening] = useState(false);
  const [copied, setCopied] = useState(false);
  const [seperator, setSeperator] = useState('4 ⎵');

  const handleChangeInput = (evt: { target: { value: string } }) =>
    setInput(evt.target.value);

  const handleOpenInput = async () => {
    setOpening(true);
    const content = await ipcRenderer.invoke('open-file', []);
    setInput(Buffer.from(content).toString());
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

  const seperators = ['4 ⎵', '2 ⎵', '1 Tab', 'Minified'];

  useEffect(() => {
    let sep: string | number | undefined = '\t';
    if (seperator === '4 ⎵') {
      sep = 4;
    } else if (seperator === '2 ⎵') {
      sep = 2;
    } else if (seperator === 'Minified') {
      sep = undefined;
    }

    try {
      const out = JSON.stringify(JSON.parse(input), null, sep);
      setOutput(out);
    } catch (e) {
      setOutput(e.message);
    }
  }, [input, seperator]);

  useEffect(() => {
    if (location.state && location.state.input1) {
      setInput(location.state.input1);
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-full">
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
        </span>
        <span className="flex space-x-4">
          {seperators.map((sep) => (
            <label
              htmlFor={sep}
              className="flex items-center space-x-1"
              key={sep}
            >
              <input
                type="radio"
                className="btn"
                name="seperator"
                id={sep}
                checked={seperator === sep}
                onChange={() => setSeperator(sep)}
              />
              <p>{sep}</p>
            </label>
          ))}
          <button
            type="button"
            className="w-16 btn"
            onClick={handleCopyOutput}
            disabled={copied}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </span>
      </div>
      <div className="flex flex-1 min-h-full space-x-2">
        <textarea
          onChange={handleChangeInput}
          className="flex-1 min-h-full p-2 bg-white rounded-md"
          value={input}
          disabled={opening}
        />
        <textarea
          className="flex-1 min-h-full p-2 bg-gray-100 rounded-md"
          value={output}
          readOnly
        />
      </div>
    </div>
  );
};

export default JsonFormatter;
