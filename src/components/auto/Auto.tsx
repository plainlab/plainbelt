import { clipboard } from 'electron';
import path from 'path';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { decode } from 'jsonwebtoken';

const detectRouteData = (value: string) => {
  const intVal = parseInt(value, 10);

  // Unix
  if (intVal > 1_600_000_000 && intVal < 2_000_000_000) {
    return { route: '/unix-converter', state: { input1: intVal } };
  }

  // Json
  try {
    JSON.parse(value);
    return { route: '/json-formatter', state: { input1: value } };
  } catch (e) {
    // ignore
  }

  try {
    const validJwt = decode(value);
    if (validJwt) {
      return { route: '/jwt-debugger', state: { input1: value } };
    }
  } catch (e) {
    // ignore
  }

  return {};
};

const Auto = () => {
  const [value, setValue] = useState('');
  const history = useHistory();

  useEffect(() => {
    setValue(clipboard.readText());
  }, []);

  useEffect(() => {
    const routeData = detectRouteData(value);
    if (routeData.route) {
      history.push(routeData.route, { ...routeData.state });
    }
  }, [value, history]);

  return (
    <div className="flex flex-col items-center w-full min-h-full">
      <section className="flex flex-col items-center justify-center flex-1">
        <section className="flex items-center justify-center w-full h-full">
          <img
            src={path.join(__dirname, '../assets/', 'icon.png')}
            alt="PlainBelt logo"
            className="w-32"
          />
        </section>
        <p className="mt-4 text-lg font-bold">PlainBelt</p>
        <a href="https://plainbelt.github.io" className="opacity-70">
          https://plainbelt.github.io
        </a>
      </section>
      <div className="flex items-center justify-between w-full my-1">
        <span>No tools was detected for this content:</span>
        <button type="button" className="w-16 btn" onClick={() => setValue('')}>
          Clear
        </button>
      </div>
      <textarea className="flex w-full p-2 h-1/3" value={value} readOnly />
    </div>
  );
};

export default Auto;
