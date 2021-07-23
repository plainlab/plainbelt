/* eslint-disable react/no-danger */
import React, { useState } from 'react';

const HtmlPreview = () => {
  const [html, setHtml] = useState(
    '<h1>Hello</h1>\n<quote>This is a quote</quote>'
  );

  const handleChange = (evt: { target: { value: string } }) =>
    setHtml(evt.target.value);

  return (
    <div className="flex min-h-full">
      <textarea
        onChange={handleChange}
        className="flex-1 min-h-full bg-white p-4"
        value={html}
      />
      <div className="mx-1" />
      <section
        className="flex-1 min-h-full bg-blue-50 p-4 prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default HtmlPreview;
