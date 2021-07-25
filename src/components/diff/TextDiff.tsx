/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import { clipboard } from 'electron';
import { Change } from 'diff';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { camelToText } from '../../helpers/stringUtils';

const DiffLib = require('diff');

const TextDiff = () => {
  const [left, setLeft] = useState('Left text');
  const [right, setRight] = useState('Right text');
  const [diff, setDiff] = useState('');
  const [diffCount, setDiffCount] = useState(0);
  const [diffType, setDiffType] = useState('diffChars');

  const handleChangeLeft = (evt: { target: { value: string } }) =>
    setLeft(evt.target.value);

  const handleChangeRight = (evt: { target: { value: string } }) =>
    setRight(evt.target.value);

  const handleClipboardLeft = () => {
    setLeft(clipboard.readText());
  };

  const handleClipboardRight = () => {
    setRight(clipboard.readText());
  };

  const handleSwap = () => {
    setRight(left);
    setLeft(right);
  };

  const diffTypes = ['diffChars', 'diffWords', 'diffLines'];

  useEffect(() => {
    const diffFunc = DiffLib[diffType];
    const changes = diffFunc(left, right);
    let c = 0;

    const d = changes
      .map((part: Change) => {
        // eslint-disable-next-line no-nested-ternary
        const cl = part.added
          ? 'text-green-600'
          : part.removed
          ? 'text-red-600'
          : 'text-grey-600';
        c += part.added || part.removed ? 1 : 0;
        return `<span class="${cl}">${part.value}</span>`;
      })
      .join('');

    setDiffCount(c);
    setDiff(d);
  }, [left, right, diffType]);

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex justify-between mb-1">
        <span className="flex space-x-2">
          <button type="button" className="btn" onClick={handleClipboardLeft}>
            Clipboard
          </button>
        </span>
        <span className="flex space-x-2">
          <button type="button" className="btn" onClick={handleSwap}>
            <FontAwesomeIcon icon="exchange-alt" />
          </button>
        </span>
        <span className="flex space-x-2">
          <button type="button" className="btn" onClick={handleClipboardRight}>
            Clipboard
          </button>
        </span>
      </div>
      <section className="flex flex-col flex-1 min-h-full space-y-2">
        <div className="flex flex-1 min-h-full space-x-2">
          <textarea
            onChange={handleChangeLeft}
            className="flex-1 min-h-full p-4 bg-white rounded-md"
            value={left}
          />
          <textarea
            onChange={handleChangeRight}
            className="flex-1 min-h-full p-4 bg-white rounded-md"
            value={right}
          />
        </div>

        <div className="flex items-center justify-between space-x-4 flex-0">
          <div className="flex items-center space-x-4 flex-0">
            {diffTypes.map((dt) => (
              <label
                htmlFor={dt}
                className="flex items-center space-x-1"
                key={dt}
              >
                <input
                  type="radio"
                  className="btn"
                  name="diffType"
                  id={dt}
                  checked={diffType === dt}
                  onChange={() => setDiffType(dt)}
                />
                <p>{camelToText(dt)}</p>
              </label>
            ))}
          </div>
          <p>
            {diffCount} change{diffCount === 1 ? '' : 's'}
          </p>
        </div>

        <section
          className="flex-1 w-full min-h-full p-4 bg-gray-100 rounded-md"
          dangerouslySetInnerHTML={{ __html: diff }}
        />
      </section>
    </div>
  );
};

export default TextDiff;
