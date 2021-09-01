/* eslint-disable no-eval */
import React, { useState } from 'react';
import { ipcRenderer, clipboard } from 'electron';
import { UnControlled as CodeMirror } from 'react-codemirror2';

require('codemirror/mode/javascript/javascript');

const fib = `const fibonacci = (n) => {
  const fibs = []

  fibs[0] = 0
  fibs[1] = 1
  for (let i = 2; i <= n; i++) {
    fibs[i] = fibs[i - 2] + fibs[i - 1]
  }

  return fibs[n]
}

fibonacci(10)`;

const JsNotebook = () => {
  const [content, setContent] = useState(fib);
  const [output, setOutput] = useState(eval(fib));

  const [opening, setOpening] = useState(false);
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
