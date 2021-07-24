import { ipcRenderer } from 'electron';
import React, { useState } from 'react';
import { useDebouncedEffect } from '../../helpers/effectHooks';

const HtmlPreview = () => {
  const [content, setContent] = useState('https://plainbelt.github.io');
  const [qrCode, setQrCode] = useState();
  const [opening, setOpening] = useState(false);
  const [saving, setSaving] = useState(false);

  useDebouncedEffect(
    () => {
      ipcRenderer
        .invoke('generate-qrcode', { content })
        .then((qr) => setQrCode(qr))
        .catch(() => {});
    },
    [content],
    500
  );

  const handleChange = async (evt: { target: { value: string } }) => {
    setContent(evt.target.value);
  };

  const handleOpen = async () => {
    setOpening(true);
    const filters = [{ name: 'Text Files', extensions: ['txt'] }];
    const data = await ipcRenderer.invoke('open-file', filters);
    setContent(data);
    setOpening(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await ipcRenderer.invoke('save-file', {
      content: qrCode,
      defaultPath: 'qrcode.png',
    });
    setSaving(false);
  };

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex justify-between mb-1">
        <button
          type="button"
          className="btn"
          onClick={handleOpen}
          disabled={opening}
        >
          Open...
        </button>
        <button
          type="button"
          className="btn"
          onClick={handleSave}
          disabled={saving}
        >
          Save...
        </button>
      </div>
      <div className="flex flex-1 min-h-full">
        <textarea
          onChange={handleChange}
          className="flex-1 min-h-full bg-white p-4 rounded-md"
          value={content}
        />
        <div className="mx-1" />
        <section className="flex-1 min-h-full flex items-center p-4 prose bg-white rounded-md">
          {qrCode && <img src={qrCode} alt={content} />}
        </section>
      </div>
    </div>
  );
};

export default HtmlPreview;
