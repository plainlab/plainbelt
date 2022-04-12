/* eslint-disable no-eval */
import React, { useState, useEffect, useCallback } from 'react';
import { ipcRenderer, clipboard } from 'electron';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { useLocation } from 'react-router-dom';

require('codemirror/mode/javascript/javascript');

const defaultFunc = `function(x) {
  return x;
}`;

const CustomScript = () => {
  const [customFunc, setCustomFunc] = useState(defaultFunc);
  const [output, setOutput] = useState();
  const [input, setInput] = useState("'your argument'");

  const [opening, setOpening] = useState(false);
  const [running, setRunning] = useState(false);
  const location = useLocation();

  useEffect(() => {
    (async () => {
      try {
        const {
          customFunction,
          defaultInput,
        } = await ipcRenderer.invoke('get-store', { key: location.pathname });
        setCustomFunc(customFunction);
        setInput(defaultInput);
      } catch (e) {
        // do nothing
      }
    })();
  }, []);

  const handleOpen = async () => {
    setOpening(true);
    const filters = [{ name: 'JavaScript Files', extensions: ['js'] }];
    const c = await ipcRenderer.invoke('open-file', filters);
    setCustomFunc(Buffer.from(c).toString());
    setOpening(false);
  };

  const handleClipboard = () => {
    setCustomFunc(clipboard.readText());
  };

  const getOutPut = () => {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return new Function(`return (${customFunc})(${input})`)();
  };

  const handleRun = () => {
    setRunning(true);
    try {
      setOutput(getOutPut());
    } catch (e) {
      setOutput(e.message);
    }
    setRunning(false);
  };

  const handleSave = useCallback(async () => {
    try {
      await ipcRenderer.invoke('set-store', {
        key: location.pathname,
        value: {
          customFunction: customFunc,
          defaultInput: input,
        },
      });
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e.message);
    }
  }, [customFunc, input, location.pathname]);

  useEffect(() => {
    handleSave();
  }, [handleSave]);

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
          className="h-1/2 overflow-auto text-base resize-y"
          value={customFunc}
          options={{
            theme: 'elegant',
            mode: 'javascript',
            lineNumbers: true,
          }}
          onChange={(_editor, _data, value) => {
            setCustomFunc(value);
          }}
        />
        <CodeMirror
          autoCursor={false}
          className="h-1/4 overflow-auto text-base resize-y"
          value={input}
          options={{
            theme: 'elegant',
            mode: 'javascript',
            lineNumbers: true,
          }}
          onChange={(_editor, _data, value) => {
            setInput(value);
          }}
        />
        <textarea
          className="h-1/4 p-2 bg-gray-100 rounded-md"
          placeholder="Hit Run to view output"
          value={output}
          readOnly
        />
      </div>
    </div>
  );
};

export default CustomScript;
