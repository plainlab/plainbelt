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
import { useLocation } from 'react-router-dom';

interface LocationState {
  input1: string;
}
const jwtInputPlaceHolder =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.keH6T3x1z7mmhKL1T3r9sQdAxxdzB6siemGMr_6ZOwU';

const JwtDebugger = () => {
  const location = useLocation<LocationState>();
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
  // for copying payload
  const [copied, setCopied] = useState(false);

  const formatForDisplay = (json: JwtHeader | JwtPayload) =>
    JSON.stringify(json, null, 4);

  const decodeJWT = (token: string) => decode(token, { complete: true });

  const handleJwtInputChanged = (evt: { target: { value: string } }) => {
    setJwtInput(evt.target.value);
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

  useEffect(() => {
    try {
      const jwt = decodeJWT(jwtInput);
      if (jwt) {
        if (!_isEqual(jwt.header, header)) setHeader(jwt.header);
        if (!_isEqual(jwt.payload, payload)) setPayload(jwt.payload);
      }
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e.message);
    }
    try {
      verify(jwtInput, secret, { algorithms: [algorithm] });
      setVerifyError(false);
    } catch (e) {
      setVerifyError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwtInput]);

  useEffect(() => {
    if (location.state && location.state.input1) {
      setJwtInput(location.state.input1);
    }
  }, [location]);

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
      <div className="flex justify-between mb-1">
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
      <div className="flex flex-1 min-h-full space-x-4">
        <section className="flex flex-col flex-1">
          <textarea
            className="flex-1 min-h-full p-2 bg-white rounded-md"
            onChange={handleJwtInputChanged}
            value={jwtInput}
            disabled={opening}
          />
        </section>
        <section className="flex flex-col flex-1">
          <div className="flex-1 p-2 bg-gray-100 rounded-md">
            <div className="mb-4">
              <p className="mb-1">Header:</p>
              <textarea
                className="flex-1 w-full h-40 p-2 rounded-md"
                onChange={handleChangeHeader}
                value={formatForDisplay(header)}
                disabled={opening}
              />
            </div>
            <div className="mb-4">
              <section className="flex items-center justify-between mb-1">
                <p>Payload:</p>
                <span className="flex space-x-4">
                  <button
                    type="button"
                    className="btn"
                    onClick={handleCopyOutput}
                    disabled={copied}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </span>
              </section>
              <textarea
                className="flex-1 w-full h-40 p-2 rounded-md"
                onChange={handleChangePayload}
                value={formatForDisplay(payload)}
                disabled={opening}
              />
            </div>
            <div className="mb-4">
              <p className="mb-1">Secret:</p>
              <input
                className="flex-1 w-full px-2 py-1 bg-white rounded-md"
                onChange={handleChangeSecret}
                placeholder="Secret"
                value={secret.toString()}
              />
            </div>
            <div className="mb-4">
              <p className="mb-1">Algorithm:</p>
              <select
                className="p-2 rounded-md cursor-pointer"
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
          </div>
        </section>
      </div>
    </div>
  );
};

export default JwtDebugger;
