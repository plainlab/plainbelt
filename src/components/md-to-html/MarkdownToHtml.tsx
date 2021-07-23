/* eslint-disable react/no-danger */
import React, { useState } from 'react';
import marked from 'marked';

const Md2Html = () => {
  const [md, setMd] = useState('# Hello\n> This is a quote');
  const [preview, setPreview] = useState(false);

  const handleChange = (evt: { target: { value: string } }) =>
    setMd(evt.target.value);

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex justify-end mb-1">
        <button
          type="button"
          className="rounded bg-gray-300 px-2 py-1 outline-none text-sm text-gray-600"
          onClick={() => setPreview(!preview)}
        >
          {preview ? 'Raw HTML' : 'Preview'}
        </button>
      </div>
      <div className="flex min-h-full flex-1">
        <textarea
          onChange={handleChange}
          className="flex-1 min-h-full bg-white p-4"
          value={md}
        />
        <div className="mx-1" />
        {preview ? (
          <section
            className="flex-1 min-h-full bg-blue-50 p-4 prose"
            dangerouslySetInnerHTML={{ __html: marked(md) }}
          />
        ) : (
          <textarea
            className="flex-1 min-h-full bg-blue-100 p-4"
            value={marked(md)}
            disabled
          />
        )}
      </div>
    </div>
  );
};

export default Md2Html;
