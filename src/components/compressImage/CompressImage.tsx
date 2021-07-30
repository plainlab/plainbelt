/* eslint-disable react/jsx-props-no-spreading */

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import prettyByte from 'pretty-bytes';

const CompressImageComponent = () => {
  const [listImage, setListImage] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setListImage(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />

      <div className="flex justify-center py-8 rounded-xl border-dashed border-2 border-blue-500 bg-white">
        <FontAwesomeIcon icon="download" size="2x" className="mr-4" />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop some files here, or click to select files</p>
        )}
      </div>

      <div>
        {!!listImage.length &&
          listImage.map((item: File) => (
            <div key={item.lastModified} className="flex mb-4">
              <img src={item.path} alt="" className="w-24 rounded-lg mr-4" />

              <div className="flex flex-col">
                <h4 className="text-lg font-bold">{item.name}</h4>

                <p>{prettyByte(item.size)}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CompressImageComponent;
