/* eslint-disable react/jsx-props-no-spreading */

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import prettyByte from 'pretty-bytes';

const CompressImageComponent = () => {
  const [listImage, setListImage] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.filter((item: File) =>
        item.type.includes('image/')
      );

      if (!listImage.length) {
        setListImage(newFiles);

        return;
      }

      setListImage([...listImage, ...newFiles]);
    },
    [listImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const resetImages = () => setListImage([]);

  return (
    <>
      <div {...getRootProps()} className="mb-4">
        <input {...getInputProps()} />

        <div className="flex justify-center py-8 rounded-lg border-dashed border border-green-500 bg-white">
          <FontAwesomeIcon icon="arrow-down" size="2x" className="mr-4" />

          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag and drop some files here, or click to select files</p>
          )}
        </div>
      </div>

      {!!listImage.length && (
        <>
          <div className="bg-white px-4 pt-4 rounded-lg mb-4 flex flex-col">
            {listImage.map((item: File) => (
              <div key={item.lastModified} className="flex mb-4 items-center">
                <img src={item.path} alt="" className="w-24 rounded-lg mr-4" />

                <div className="flex flex-col flex-1">
                  <h4 className="text-lg font-bold">{item.name}</h4>

                  <p>{prettyByte(item.size)}</p>
                </div>

                <FontAwesomeIcon
                  icon="trash-alt"
                  size="1x"
                  className="text-red-500 cursor-pointer"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="bg-yellow-500 text-white rounded-md px-6 py-2 mr-4 transition-all duration-200 ease-in-out hover:bg-yellow-600"
            onClick={() => resetImages()}
          >
            Reset
          </button>

          <button
            type="button"
            className="bg-green-500 text-white rounded-md px-6 py-2 transition-all duration-200 ease-in-out hover:bg-green-600"
          >
            Compress
          </button>
        </>
      )}
    </>
  );
};

export default CompressImageComponent;
