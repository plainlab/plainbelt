import React from 'react';
import OneToOne from '../common/1-to-1';

const UrlCodec = () => {
  return (
    <OneToOne
      fromDefault="https://plainlab.github.io/?q=plainbelt"
      fromFunc={encodeURIComponent}
      inverseFunc={decodeURIComponent}
    />
  );
};

export default UrlCodec;
