/* eslint-disable react/no-danger */
import React, { useState } from 'react';
import marked from 'marked';

const Md2Html = () => {
  const [md, setMd] = useState('# Hello\n> This is a quote');

  const handleChange = (evt: { target: { value: string } }) =>
    setMd(evt.target.value);

  return (
    <div className="flex min-h-full">
      <textarea
        onChange={handleChange}
        className="flex-1 min-h-full bg-white p-4 whitespace-pre"
        value={md}
      />
      <div className="mx-1" />
      <textarea
        className="flex-1 min-h-full bg-blue-100 p-4 whitespace-pre"
        value={marked(md)}
        disabled
      />
    </div>
  );
};

export default Md2Html;
