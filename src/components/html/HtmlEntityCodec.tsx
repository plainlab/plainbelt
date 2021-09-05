import React from 'react';
import { escape, unescape } from 'lodash';
import OneToOne from '../common/1-to-1';

const HtmlEntityCodec = () => {
  return (
    <OneToOne
      defaultInput='<script>alert("Hello");</script>'
      forwardFunc={escape}
      inverseFunc={unescape}
    />
  );
};

export default HtmlEntityCodec;
