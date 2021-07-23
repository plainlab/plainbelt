import React from 'react';
import { NavLink, Route } from 'react-router-dom';
import MarkdownToHtml from './md-to-html/MarkdownToHtml';
import UnixTimestamp from './unix-timestamp/UnixTimestamp';

const Main = () => {
  const routes = [
    {
      path: '/unix',
      name: 'Unix Time Converter',
      Component: UnixTimestamp,
    },
    {
      path: '/md-to-html',
      name: 'Markdown to HTML',
      Component: MarkdownToHtml,
    },
  ];

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <main className="relative flex flex-1 min-h-0">
        {/* Left sidebar */}
        <nav className="flex flex-col w-1/4 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div
            className="px-2 my-6"
            role="menu"
            aria-orientation="horizontal"
            aria-labelledby="options-menu"
          >
            {routes.map(({ path, name }) => (
              <NavLink
                to={path}
                key={path}
                className="block rounded-lg px-3 py-1 mb-1"
                activeClassName="bg-blue-400 text-white"
              >
                {name}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <section className="relative flex flex-col w-full bg-gray-100 text-base">
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
