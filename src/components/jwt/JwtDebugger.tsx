import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import _isEqual from 'lodash.isequal';
import { ipcRenderer, clipboard } from 'electron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  decode,
  verify,
  sign,
  Algorithm,
  JwtPayload,
  JwtHeader,
  Secret,
} from 'jsonwebtoken';

const jwtInputPlaceHolder =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.keH6T3x1z7mmhKL1T3r9sQdAxxdzB6siemGMr_6ZOwU';

const JwtDebugger = () => {
  const [jwtInput, setJwtInput] = useState(jwtInputPlaceHolder);
  const [header, setHeader] = useState<JwtHeader>({
    alg: 'HS256',
    typ: 'JWT',
  });
  const [payload, setPayload] = useState<JwtPayload>({
    sub: '1234567890',
    name: 'John Doe',
    iat: 1516239022,
  });
  const [algorithm, setAlgorithm] = useState<Algorithm>('HS256');
  const [secret, setSecret] = useState<Secret>('123456');

  const [verifyError, setVerifyError] = useState(false);

  // for opening files
  const [opening, setOpening] = useState(false);
  // for copying files
  const [copied, setCopied] = useState(false);

  const formatForDisplay = (json: JwtHeader | JwtPayload) =>
    JSON.stringify(json, null, 4);

  const decodeJWT = (token: string) => decode(token, { complete: true });

  const handleJwtInputChanged = (evt: { target: { value: string } }) => {
    const input = evt.target.value;
    setJwtInput(input);
    try {
      const jwt = decodeJWT(input);
      if (jwt) {
        if (!_isEqual(jwt.header, header)) setHeader(jwt.header);
        if (!_isEqual(jwt.payload, payload)) setPayload(jwt.payload);
      }
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e.message);
    }
    try {
      verify(input, secret, { algorithms: [algorithm] });
      setVerifyError(false);
    } catch (e) {
      setVerifyError(true);
    }
  };

  useEffect(() => {
    let jwt;
    try {
      jwt = sign(payload, secret, { algorithm, header });
      setJwtInput(jwt);
      setVerifyError(false);
    } catch (e) {
      setVerifyError(true);
    }
  }, [payload, secret, algorithm, header]);

  const handleChangePayload = (evt: { target: { value: string } }) => {
    try {
      setPayload(JSON.parse(evt.target.value));
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e.message);
    }
  };

  const handleChangeHeader = (evt: { target: { value: string } }) => {
    try {
      const h = JSON.parse(evt.target.value);
      setHeader(h);
      if (h.alg !== algorithm) {
        const alg = h.alg as Algorithm;
        setAlgorithm(alg);
      }
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e.message);
    }
  };

  const handleChangeAlgorithm = (evt: { target: { value: string } }) => {
    const alg = evt.target.value as Algorithm;
    setAlgorithm(alg);
    if (alg !== header.alg) {
      setHeader({
        ...header,
        alg,
      });
    }
  };

  const handleChangeSecret = (evt: { target: { value: string } }) => {
    setSecret(evt.target.value);
  };

  const handleOpenInput = async () => {
    setOpening(true);
    const content = await ipcRenderer.invoke('open-file', []);
    setJwtInput(Buffer.from(content).toString());
    setOpening(false);
  };

  const handleClipboardInput = () => {
    setJwtInput(clipboard.readText());
  };

  const handleCopyOutput = () => {
    setCopied(true);
    clipboard.write({ text: JSON.stringify(payload) });
    setTimeout(() => setCopied(false), 500);
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex justify-between mb-2">
        <span className="flex space-x-2">
          <button type="button" className="btn" onClick={handleClipboardInput}>
            Clipboard
          </button>
          <button
            type="button"
            className="btn"
            onClick={handleOpenInput}
            disabled={opening}
          >
            Open...
          </button>
        </span>
        <span className="flex space-x-4">
          <button
            type="button"
            className="w-16 btn"
            onClick={handleCopyOutput}
            disabled={copied}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </span>
      </div>
      <div className="flex flex-1 min-h-full space-x-4">
        <section className="flex flex-col flex-1">
          <div className="flex items-center mb-2">
            <h4 className="inline text-xl font-bold">Encoded</h4>
            <span className="ml-2 text-gray-500">Paste a token here</span>
            <span
              className={classNames({
                'ml-auto space-x-1': true,
                'text-green-500': !verifyError,
                'text-red-500': verifyError,
              })}
            >
              <FontAwesomeIcon icon="check-circle" />
              <span>
                {verifyError ? 'Invalid Signature' : 'Signature verified'}
              </span>
            </span>
          </div>
          <textarea
            onChange={handleJwtInputChanged}
            className="flex-1 min-h-full p-2 bg-white rounded-md"
            value={jwtInput}
            disabled={opening}
          />
        </section>
        <section className="flex flex-col flex-1">
          <div className="flex items-center mb-2">
            <h4 className="inline text-xl font-bold">Decoded</h4>
            <span className="ml-2 text-gray-500">
              View the payload and edit the secret
            </span>
            <input
              onChange={handleChangeSecret}
              placeholder="signature"
              className="flex-1 px-2 py-1 bg-white rounded-md"
              value={secret.toString()}
            />
            <select
              className="ml-auto"
              name="algorithm"
              id="algorithm"
              onChange={handleChangeAlgorithm}
              value={algorithm}
            >
              <option value="HS256">HS256</option>
              <option value="HS384">HS384</option>
              <option value="HS512">HS512</option>
            </select>
          </div>
          <div className="flex-1 min-h-full p-2 bg-gray-100 rounded-md">
            <div>
              <p>Header:</p>
              <textarea
                onChange={handleChangeHeader}
                className="flex-1 h-40 p-2"
                value={formatForDisplay(header)}
                disabled={opening}
              />
            </div>
            <div>
              <p>Payload:</p>
              <textarea
                onChange={handleChangePayload}
                className="flex-1 h-40 p-2"
                value={formatForDisplay(payload)}
                disabled={opening}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default JwtDebugger;
