import { clipboard, ipcRenderer } from 'electron';
import React, { useState } from 'react';
import { useDebouncedEffect } from '../../helpers/effectHooks';

const QRCodeGenerator = () => {
  const [content, setContent] = useState('https://plainbelt.github.io');
  const [qrCode, setQrCode] = useState();
  const [opening, setOpening] = useState(false);
  const [saving, setSaving] = useState(false);

  useDebouncedEffect(
    () => {
      let isMounted = true;
      ipcRenderer
        .invoke('generate-qrcode', { content })
        .then((qr) => isMounted && setQrCode(qr))
        .catch(() => {});
      return () => {
        isMounted = false;
      };
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
    setContent(Buffer.from(data).toString());
    setOpening(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await ipcRenderer.invoke('save-file', {
      content: (qrCode || ',').split(',')[1],
      defaultPath: 'qrcode.png',
      encoding: 'base64',
    });
    setSaving(false);
  };

  const handleClipboard = () => {
    setContent(clipboard.readText());
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex justify-between mb-1">
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

        <button
          type="button"
          className="btn"
          onClick={handleSave}
          disabled={saving}
        >
          Save...
        </button>
      </div>
      <div className="flex flex-1 min-h-full space-x-2">
        <textarea
          onChange={handleChange}
          className="flex-1 min-h-full p-2 bg-white rounded-md"
          value={content}
        />
        <section className="flex items-center flex-1 max-w-full min-h-full p-2 prose bg-gray-100 rounded-md">
          {qrCode && <img src={qrCode} alt={content} />}
        </section>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
