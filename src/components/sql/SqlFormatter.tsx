import React, { useEffect, useState } from 'react';
import { format } from 'sql-formatter';
import { ipcRenderer, clipboard } from 'electron';

const SqlFormatter = () => {
  const [input, setInput] = useState('SELECT * FROM tbl');
  const [output, setOutput] = useState('');
  const [opening, setOpening] = useState(false);
  const [copied, setCopied] = useState(false);

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

  useEffect(() => {
    setOutput(format(input));
  }, [input]);

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
        </span>
        <span className="flex space-x-4">
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
          className="flex-1 min-h-full bg-gray-100 p-4 rounded-md"
          value={output}
          readOnly
        />
      </div>
    </div>
  );
};

export default SqlFormatter;
