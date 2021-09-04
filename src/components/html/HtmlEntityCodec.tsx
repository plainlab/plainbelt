import React from 'react';
import { escape, unescape } from 'lodash';
import OneToOne from '../common/1-to-1';

const HtmlEntityCodec = () => {
  return (
    <OneToOne
      fromDefault='<script>alert("Hello");</script>'
      fromFunc={escape}
      inverseFunc={unescape}
    />
  );
};

export default HtmlEntityCodec;
