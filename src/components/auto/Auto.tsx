import { clipboard, ipcRenderer } from 'electron';
import path from 'path';
import React, { useEffect, useState } from 'react';
import { decode } from 'jsonwebtoken';
import { useHistory, useLocation } from 'react-router-dom';

const detectRouteData = (value: string) => {
  const intVal = parseInt(value, 10);

  // Unix
  if (intVal > 1_600_000_000 && intVal < 2_000_000_000) {
    return { route: '/unix-converter', state: { input1: intVal } };
  }

  // Json
  try {
    if (typeof JSON.parse(value) === 'object') {
      return { route: '/json-formatter', state: { input1: value } };
    }
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

interface LocationState {
  auto: boolean;
}

const Auto = () => {
  const [value, setValue] = useState('');
  const [hotkey, setHotkey] = useState('');
  const history = useHistory();
  const location = useLocation<LocationState>();

  useEffect(() => {
    if (location.state && location.state.auto) {
      setValue(clipboard.readText());
    }
  }, [location]);

  useEffect(() => {
    let isMounted = true;
    ipcRenderer
      .invoke('get-store', { key: 'hotkey' })
      .then((v: string) => {
        if (isMounted) setHotkey(v);
        return null;
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  });

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
        <a href="https://plainlab.github.io" className="opacity-50">
          https://plainlab.github.io
        </a>
        {hotkey && (
          <p className="mt-10 opacity-70">
            <em>Hotkey</em>: Control+Alt+Meta+Space (⌃⌥⌘Space in Mac)
          </p>
        )}
      </section>
      <div className="flex items-center justify-between w-full my-1">
        <section className="flex items-center space-x-2">
          <button
            type="button"
            className="btn"
            onClick={() => setValue(clipboard.readText())}
          >
            Clipboard
          </button>
          <button
            type="button"
            className="w-16 btn"
            onClick={() => setValue('')}
          >
            Clear
          </button>
        </section>
        {value ? <span>No tools was detected for this content</span> : <span />}
      </div>
      <textarea
        className="flex w-full p-2 h-1/3"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default Auto;
