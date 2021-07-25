import { clipboard, ipcRenderer, nativeImage } from 'electron';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';
import React, { useEffect, useState } from 'react';

const QRCodeReader = () => {
  const [image, setImage] = useState(nativeImage.createEmpty());
  const [content, setContent] = useState('');
  const [opening, setOpening] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOpen = async () => {
    setOpening(true);
    const filters = [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png'] }];
    const buff = await ipcRenderer.invoke('open-file', filters);
    setImage(nativeImage.createFromBuffer(buff));
    setOpening(false);
  };

  const handleClipboard = () => {
    setImage(clipboard.readImage());
  };

  const handleCopy = () => {
    setCopied(true);
    clipboard.write({ text: content });
    setTimeout(() => setCopied(false), 500);
  };

  useEffect(() => {
    try {
      const qr = jsQR(
        Uint8ClampedArray.from(PNG.sync.read(image.toPNG()).data),
        image.getSize().width,
        image.getSize().height
      );
      setContent(qr?.data || 'No QRCode detected');
    } catch (e) {
      setContent('No QRCode detected');
    }
  }, [image]);

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
          onClick={handleCopy}
          disabled={copied}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="flex flex-1 min-h-full space-x-2">
        <section className="flex items-center flex-1 max-w-full min-h-full p-4 prose bg-gray-100 rounded-md">
          {image && !image.isEmpty() && (
            <img src={image.toDataURL()} alt="QRCode" />
          )}
        </section>
        <textarea
          className="flex-1 min-h-full p-4 bg-white rounded-md"
          value={content}
          readOnly
        />
      </div>
    </div>
  );
};

export default QRCodeReader;
