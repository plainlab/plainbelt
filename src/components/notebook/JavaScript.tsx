import React, { useState } from 'react';
import { ipcRenderer, clipboard } from 'electron';
import { UnControlled as CodeMirror } from 'react-codemirror2';

require('codemirror/mode/javascript/javascript');

const JsNotebook = () => {
  const [content, setContent] = useState('1 + 1');
  const [output, setOutput] = useState('2');

  const [opening, setOpening] = useState(false);
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);

  const handleOpen = async () => {
    setOpening(true);
    const filters = [{ name: 'JavaScript Files', extensions: ['js'] }];
    const c = await ipcRenderer.invoke('open-file', filters);
    setContent(Buffer.from(c).toString());
    setOpening(false);
  };

  const handleClipboard = () => {
    setContent(clipboard.readText());
  };

  const handleCopy = () => {
    setCopied(true);
    clipboard.write({ text: output });
    setTimeout(() => setCopied(false), 500);
  };

  const handleRun = () => {
    setRunning(true);
    try {
      // eslint-disable-next-line no-eval
      setOutput(eval(content));
    } catch (e) {
      setOutput(e.message);
    }
    setRunning(false);
  };

  return (
    <div className="flex flex-col flex-shrink-0 h-full min-h-full">
      <div className="flex justify-between mb-1">
        <span className="flex space-x-4">
          <span className="flex space-x-2">
            <button type="button" className="btn" onClick={handleClipboard}>
              Clipboard
            </button>
            <button
              type="button"
              className="btn"
              onClick={handleOpen}
              disabled={opening}
            >
              Open...
            </button>
          </span>
        </span>
        <span className="flex space-x-2">
          <button
            type="button"
            onClick={handleRun}
            className="w-16 btn"
            disabled={running}
          >
            {running ? 'Running' : 'Run'}
          </button>
          <button
            type="button"
            className="w-16 btn"
            onClick={handleCopy}
            disabled={copied}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </span>
      </div>
      <div className="flex flex-col flex-1 h-full space-y-2 overflow-auto">
        <CodeMirror
          autoCursor={false}
          className="flex-1 overflow-auto text-base"
          value={content}
          options={{
            theme: 'elegant',
            mode: 'javascript',
            lineNumbers: true,
          }}
          onChange={(_editor, _data, value) => {
            setContent(value);
          }}
        />
        <textarea
          className="flex-shrink-0 p-2 bg-gray-100 rounded-md"
          value={output}
          readOnly
        />
      </div>
    </div>
  );
};

export default JsNotebook;
