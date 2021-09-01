import React, { useEffect, useState } from 'react';
import { clipboard } from 'electron';
import cronstrue from 'cronstrue';
import classNames from 'classnames';

const defaultCron = '29 8 * * *';
const examples = [
  '* * * * * *',
  '* * * * *',
  '0 * * * *',
  '0 */12 * * *',
  '0 0 * * MON',
  '0 0 * * 6,0',
  '0 0 1 * *',
  '0 0 1 */3 *',
  '0 0 1 */6 *',
  '0 0 1 1 *',
];

const CronEditor = () => {
  const [input, setInput] = useState(defaultCron);
  const [output, setOutput] = useState(cronstrue.toString(defaultCron));
  const [inputErr, setInputErr] = useState(false);

  const handleChangeInput = (evt: { target: { value: string } }) =>
    setInput(evt.target.value);

  const handleClipboardInput = () => {
    setInput(clipboard.readText());
  };

  useEffect(() => {
    try {
      const mean = cronstrue.toString(input);
      setOutput(mean);
      setInputErr(false);
    } catch (e) {
      setOutput(e);
      setInputErr(true);
    }
  }, [input]);

  return (
    <div className="flex flex-col h-full">
      <section className="flex flex-col flex-1 w-full h-full space-y-8">
        <section className="flex flex-col">
          <div className="flex justify-between mb-1">
            <button
              type="button"
              className="btn"
              onClick={handleClipboardInput}
            >
              Clipboard
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              onChange={handleChangeInput}
              className="flex-1 px-2 py-1 text-center bg-white rounded-md"
              value={input}
            />
          </div>
        </section>
        <section
          className={classNames({
            'flex flex-col flex-shrink-0 text-center text-base': true,
            'text-blue-500': !inputErr,
            'text-red-500': inputErr,
          })}
        >
          {!inputErr && '"'}
          {output}
          {!inputErr && '"'}
        </section>
        <section className="flex flex-col items-start justify-start flex-shrink-0 pt-2 space-y-4 border-t border-gray-300 opacity-70">
          <p className="italic">Rules:</p>
          <table>
            <tbody>
              <tr className="flex space-x-4">
                <th>*</th>
                <td>any value</td>
              </tr>
              <tr className="flex space-x-4">
                <th>,</th>
                <td>value list separator</td>
              </tr>
              <tr className="flex space-x-4">
                <th>-</th>
                <td>range of values</td>
              </tr>
              <tr className="flex space-x-4">
                <th>/</th>
                <td>step values</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="flex flex-col items-start justify-start flex-shrink-0 pt-2 space-y-4 border-t border-gray-300 opacity-70">
          <p className="italic">Examples:</p>
          <table>
            <tbody>
              {examples.map((c) => (
                <tr
                  className="flex space-x-4 cursor-pointer"
                  key={c}
                  onClick={() => setInput(c)}
                >
                  <th className="w-32 text-left">{c}</th>
                  <td>{cronstrue.toString(c)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
    </div>
  );
};

export default CronEditor;
