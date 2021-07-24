import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';

const HtmlPreview = () => {
  const [content, setContent] = useState('https://plainbelt.github.io');
  const [qrCode, setQrCode] = useState();
  const [opening, setOpening] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    ipcRenderer
      .invoke('generate-qrcode', { content })
      .then((qr) => setQrCode(qr))
      .catch(() => {});
  });

  const handleChange = async (evt: { target: { value: string } }) => {
    setContent(evt.target.value);
    const qr = await ipcRenderer.invoke('generate-qrcode', { content });
    setQrCode(qr);
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
      <div className="flex min-h-full">
        <textarea
          onChange={handleChange}
          className="flex-1 min-h-full bg-white p-4"
          value={content}
        />
        <div className="mx-1" />
        {qrCode && (
          <section className="flex-1 min-h-full flex items-center p-4 prose bg-white">
            <img src={qrCode} alt={content} className="w-full h-full" />
          </section>
        )}
      </div>
    </div>
  );
};

export default HtmlPreview;
