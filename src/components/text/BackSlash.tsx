import React from 'react';
import OneToOne from '../common/1-to-1';

const addSlashes = (string: string) => {
  return (
    string
      .replace(/\\/g, '\\\\')
      // eslint-disable-next-line no-control-regex
      .replace(/\u0008/g, '\\b')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\f/g, '\\f')
      .replace(/\r/g, '\\r')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
  );
};

const removeSlashes = (string: string) => {
  return string
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\r/g, '\r')
    .replace(/\\f/g, '\f')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\b/, '\u0008')
    .replace(/\\\\/g, '\\');
};

const BackSlashCodec = () => {
  return (
    <OneToOne
      defaultInput="Hello\nworld!"
      forwardFunc={removeSlashes}
      inverseFunc={addSlashes}
    />
  );
};

export default BackSlashCodec;
