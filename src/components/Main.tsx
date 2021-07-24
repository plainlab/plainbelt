import React from 'react';
import { NavLink, Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MarkdownToHtml from './markdown/MarkdownToHtml';
import UnixTimestamp from './timestamp/UnixTimestamp';
import HtmlPreview from './html/HtmlPreview';
import QrCodeGenerator from './qrcode/QrCodeGenerator';
import Base64 from './base64/Base64';
import DiffText from './diff/TextDiff';
import SqlFormatter from './sql/SqlFormatter';

const Main = () => {
  const routes = [
    {
      icon: <FontAwesomeIcon icon="clock" />,
      path: '/unix-converter',
      name: 'Unix Time Converter',
      Component: UnixTimestamp,
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
      icon: <FontAwesomeIcon icon="database" />,
      path: '/sql-formatter',
      name: 'SQL Formatter',
      Component: SqlFormatter,
    },
  ];

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <main className="relative flex flex-1 min-h-0">
        {/* Left sidebar */}
        <nav className="flex flex-col w-1/4 overflow-x-hidden overflow-y-auto bg-gray-300">
          <div
            className="px-2 my-6"
            role="menu"
            aria-orientation="horizontal"
            aria-labelledby="options-menu"
          >
            {routes.map(({ path, name, icon }) => (
              <NavLink
                to={path}
                key={path}
                className="rounded-lg px-3 py-1 mb-1 space-x-1 items-center justify-start flex"
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
          <div className="h-full overflow-x-hidden overflow-y-auto px-6 my-6">
            {routes.map(({ path, Component }) => (
              <Route key={path} exact path={path}>
                <Component />
              </Route>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Main;
