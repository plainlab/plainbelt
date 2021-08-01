import React, { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { ipcRenderer } from 'electron';

const PdfEditor = () => {
  const [pdfFile, setPdfFile] = useState('');
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [opening, setOpening] = useState(false);

  const handleOpen = async () => {
    setOpening(true);
    const filters = [{ name: 'PDF Files', extensions: ['pdf'] }];
    const path = await ipcRenderer.invoke('open-file', filters, 'path');
    setPdfFile(path);
    setOpening(false);
  };

  const onDocumentLoadSuccess = ({ numPages: n }: { numPages: number }) => {
    setNumPages(n);
  };

  return (
    <div>
      <button
        type="button"
        className="btn"
        onClick={handleOpen}
        disabled={opening}
      >
        Open...
      </button>

      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex items-center justify-center p-4"
      >
        <Page pageNumber={pageNumber} />
      </Document>

      <div className="flex items-center justify-between">
        {pageNumber > 1 ? (
          <button type="button" onClick={() => setPageNumber(pageNumber - 1)}>
            &lt; Back
          </button>
        ) : (
          <p />
        )}
        <p>
          Page {pageNumber} of {numPages}
        </p>
        {pageNumber < numPages ? (
          <button type="button" onClick={() => setPageNumber(pageNumber + 1)}>
            Next &gt;
          </button>
        ) : (
          <p />
        )}
      </div>
    </div>
  );
};

export default PdfEditor;
