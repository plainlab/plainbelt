import React, { useState } from 'react';
import { NavLink, Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet';

import MarkdownToHtml from './markdown/MarkdownToHtml';
import UnixTimestamp from './timestamp/UnixTimestamp';
import HtmlPreview from './html/HtmlPreview';
import QrCodeGenerator from './qrcode/QrCodeGenerator';
import Base64 from './base64/Base64';
import DiffText from './diff/TextDiff';
import SqlFormatter from './sql/SqlFormatter';
import JsonFormatter from './json/JsonFormatter';
import QRCodeReader from './qrcode/QrCodeReader';
import RegexTester from './regex/RegexTester';

const Main = () => {
  const routes = [
    {
      icon: <FontAwesomeIcon icon="clock" />,
      path: '/unix-converter',
      name: 'Unix Time Converter',
      Component: UnixTimestamp,
    },
    {
      icon: <FontAwesomeIcon icon="registered" />,
      path: '/regex-tester',
      name: 'Regex Tester',
      Component: RegexTester,
    },
    {
      icon: <FontAwesomeIcon icon={['fab', 'markdown']} />,
      path: '/markdown-to-html',
      name: 'Markdown to HTML',
      Component: MarkdownToHtml,
    },
    {
      icon: <FontAwesomeIcon icon={['fab', 'html5']} />,
      path: '/html-preview',
      name: 'HTML Preview',
      Component: HtmlPreview,
    },
    {
      icon: <FontAwesomeIcon icon="qrcode" />,
      path: '/qrcode-generator',
      name: 'QRCode Generator',
      Component: QrCodeGenerator,
    },
    {
      icon: <FontAwesomeIcon icon="camera" />,
      path: '/qrcode-reader',
      name: 'QRCode Reader',
      Component: QRCodeReader,
    },
    {
      icon: <FontAwesomeIcon icon="code" />,
      path: '/base64-encoder',
      name: 'Base64 Encoder',
      Component: Base64,
    },
    {
      icon: <FontAwesomeIcon icon="exchange-alt" />,
      path: '/text-diff',
      name: 'Text Diff',
      Component: DiffText,
    },
    {
      icon: <FontAwesomeIcon icon={['fab', 'js-square']} />,
      path: '/json-formatter',
      name: 'JSON Formatter',
      Component: JsonFormatter,
    },
    {
      icon: <FontAwesomeIcon icon="database" />,
      path: '/sql-formatter',
      name: 'SQL Formatter',
      Component: SqlFormatter,
    },
  ];

  const [search, setSearch] = useState('');
  const handleSearch = (e: { target: { value: string } }) => {
    setSearch(e.target.value);
  };

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <main className="relative flex flex-1 min-h-0">
        {/* Left sidebar */}
        <nav className="flex flex-col w-1/4 overflow-x-hidden overflow-y-auto bg-gray-300">
          <div className="flex items-center m-2 space-x-1 text-gray-400 bg-gray-200 rounded-md focus-within:text-gray-600">
            <FontAwesomeIcon icon="search" className="ml-3" />
            <input
              type="text"
              className="w-full p-1 bg-gray-200 border-none rounded-r-md focus:outline-none focus:ring-0"
              value={search}
              onChange={handleSearch}
              placeholder="Search..."
            />
          </div>

          <div
            className="px-2 my-4"
            role="menu"
            aria-orientation="horizontal"
            aria-labelledby="options-menu"
          >
            {routes.map(({ path, name, icon }) => (
              <NavLink
                to={path}
                key={path}
                className="flex items-center justify-start px-3 py-1 mb-1 space-x-1 rounded-lg"
                activeClassName="bg-blue-400 text-white"
              >
                <span className="w-6">{icon}</span>
                {name}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <section className="relative flex flex-col w-full bg-gray-200">
          <div className="h-full px-6 my-6 overflow-x-hidden overflow-y-auto">
            {routes.map(({ path, name, Component }) => (
              <Route key={path} exact path={path}>
                <Component />
                <Helmet>
                  <title>{name}</title>
                </Helmet>
              </Route>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Main;
