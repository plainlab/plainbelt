import React, { useEffect, useState } from 'react';
import { clipboard } from 'electron';
import { loremIpsum } from 'lorem-ipsum';

type Unit = 'words' | 'sentences' | 'paragraphs';
type Format = 'html' | 'plain';

const LoremIpsum = () => {
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [units, setUnits] = useState<Unit>('paragraphs');
  const [format, setFormat] = useState<Format>('plain');
  const [count, setCount] = useState(5);

  const handleCopyOutput = () => {
    setCopied(true);
    clipboard.write({ text: output });
    setTimeout(() => setCopied(false), 500);
  };

  const unitsList = ['words', 'sentences', 'paragraphs'];
  const formatList = [
    {
      f: 'html',
      l: 'HTML',
    },
    {
      f: 'plain',
      l: 'Text',
    },
  ];

  useEffect(() => {
    setOutput(loremIpsum({ units, count, format }));
  }, [units, count, format]);

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex justify-between mb-1">
        <span className="flex space-x-4">
          <input
            type="number"
            className="w-20 text-center"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10) || 5)}
          />

          {unitsList.map((unit) => (
            <label
              htmlFor={unit}
              className="flex items-center space-x-1"
              key={unit}
            >
              <input
                type="radio"
                className="btn"
                name="unit"
                id={unit}
                checked={unit === units}
                onChange={() => setUnits(unit as Unit)}
              />
              <p>{unit}</p>
            </label>
          ))}
        </span>

        <span className="flex items-center justify-center space-x-4">
          {formatList.map(({ f, l }) => (
            <label htmlFor={f} className="flex items-center space-x-1" key={f}>
              <input
                type="radio"
                className="btn"
                name="format"
                id={f}
                checked={f === format}
                onChange={() => setFormat(f as Format)}
              />
              <p>{l}</p>
            </label>
          ))}
        </span>

        <button
          type="button"
          className="w-16 btn"
          onClick={handleCopyOutput}
          disabled={copied}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="flex flex-1 min-h-full space-x-2">
        <textarea
          className="flex-1 min-h-full p-2 bg-gray-100 rounded-md"
          value={output}
          readOnly
        />
      </div>
    </div>
  );
};

export default LoremIpsum;
