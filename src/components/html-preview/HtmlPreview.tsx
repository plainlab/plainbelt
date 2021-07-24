/* eslint-disable react/no-danger */
import { clipboard, ipcRenderer } from 'electron';
import React, { useState } from 'react';

const HtmlPreview = () => {
  const [html, setHtml] = useState(
    '<h1>Hello</h1>\n<blockquote>This is a quote</blockquote>'
  );
  const [opening, setOpening] = useState(false);

  const handleChange = (evt: { target: { value: string } }) =>
    setHtml(evt.target.value);

  const handleOpen = async () => {
    setOpening(true);
    const filters = [{ name: 'HTML Files', extensions: ['htm', 'html'] }];
    const content = await ipcRenderer.invoke('open-file', filters);
    setHtml(content);
    setOpening(false);
  };

  const handleClipboard = () => {
    setHtml(clipboard.readText());
  };

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex justify-start mb-1 space-x-2">
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
      </div>
      <div className="flex flex-1 min-h-full">
        <textarea
          onChange={handleChange}
          className="flex-1 min-h-full bg-white p-4 rounded-md"
          value={html}
          disabled={opening}
        />
        <div className="mx-1" />
        <section
          className="flex-1 min-h-full bg-blue-50 p-4 prose rounded-md"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
};

export default HtmlPreview;
