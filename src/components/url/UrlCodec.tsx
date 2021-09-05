import React from 'react';
import OneToOne from '../common/1-to-1';

const UrlCodec = () => {
  return (
    <OneToOne
      defaultInput="https://plainlab.github.io/?q=plainbelt"
      forwardFunc={encodeURIComponent}
      inverseFunc={decodeURIComponent}
    />
  );
};

export default UrlCodec;
