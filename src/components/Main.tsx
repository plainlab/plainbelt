import React, { ComponentType, ReactElement, useEffect, useState } from 'react';
import { NavLink, Route, useHistory, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet';
import { ipcRenderer } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';
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
import JwtDebugger from './jwt/JwtDebugger';
import CustomScript from './custom-script/CustomScript';
import Auto from './auto/Auto';
import CronEditor from './cron/Cron';
import JsConsole from './notebook/JavaScript';
import HtmlEntityCodec from './html/HtmlEntityCodec';
import UrlCodec from './url/UrlCodec';
import BackSlashCodec from './text/BackSlash';
import LoremIpsum from './text/LoremIpsum';

interface MenuItem {
  path: string;
  name: string;
  show: boolean;
  icon: ReactElement<any, any>;
  Component: ComponentType;
}

const defaultRoutes: MenuItem[] = [
  {
    icon: <FontAwesomeIcon icon="robot" />,
    path: '/auto',
    name: 'Auto Detection',
    show: true,
    Component: Auto,
  },
  {
    icon: <FontAwesomeIcon icon="clock" />,
    path: '/unix-converter',
    name: 'Unix Time Converter',
    show: true,
    Component: UnixTimestamp,
  },
  {
    icon: <FontAwesomeIcon icon="retweet" />,
    path: '/cron-editor',
    name: 'Cron Editor',
    show: true,
    Component: CronEditor,
  },
  {
    icon: <FontAwesomeIcon icon="registered" />,
    path: '/regex-tester',
    name: 'Regex Tester',
    show: true,
    Component: RegexTester,
  },
  {
    icon: <FontAwesomeIcon icon="random" />,
    path: '/lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    show: true,
    Component: LoremIpsum,
  },
  {
    icon: <FontAwesomeIcon icon={['fab', 'markdown']} />,
    path: '/markdown-to-html',
    name: 'Markdown to HTML',
    show: true,
    Component: MarkdownToHtml,
  },
  {
    icon: <FontAwesomeIcon icon={['fab', 'html5']} />,
    path: '/html-preview',
    name: 'HTML Preview',
    show: true,
    Component: HtmlPreview,
  },
  {
    icon: <FontAwesomeIcon icon="qrcode" />,
    path: '/qrcode-generator',
    name: 'QRCode Generator',
    show: true,
    Component: QrCodeGenerator,
  },
  {
    icon: <FontAwesomeIcon icon="camera" />,
    path: '/qrcode-reader',
    name: 'QRCode Reader',
    show: true,
    Component: QRCodeReader,
  },
  {
    icon: <FontAwesomeIcon icon="code" />,
    path: '/base64-encoder',
    name: 'Base64 Encoder',
    show: true,
    Component: Base64,
  },
  {
    icon: <FontAwesomeIcon icon="exchange-alt" />,
    path: '/text-diff',
    name: 'Text Diff',
    show: true,
    Component: DiffText,
  },
  {
    icon: <FontAwesomeIcon icon={['fab', 'js-square']} />,
    path: '/json-formatter',
    name: 'JSON Formatter',
    show: true,
    Component: JsonFormatter,
  },
  {
    icon: <FontAwesomeIcon icon="database" />,
    path: '/sql-formatter',
    name: 'SQL Formatter',
    show: true,
    Component: SqlFormatter,
  },
  {
    icon: <FontAwesomeIcon icon="key" />,
    path: '/jwt-debugger',
    name: 'JWT Debugger',
    show: true,
    Component: JwtDebugger,
  },
  {
    icon: <FontAwesomeIcon icon={['fab', 'js']} />,
    path: '/js-console',
    name: 'Js Console',
    show: false,
    Component: JsConsole,
  },
  {
    icon: <FontAwesomeIcon icon="file-code" />,
    path: '/html-entity-encoder',
    name: 'HTML Entity Encoder',
    show: false,
    Component: HtmlEntityCodec,
  },
  {
    icon: <FontAwesomeIcon icon="link" />,
    path: '/url-encoder',
    name: 'URL Encoder',
    show: false,
    Component: UrlCodec,
  },
  {
    icon: <FontAwesomeIcon icon="slash" transform={{ rotate: 42 }} />,
    path: '/back-slash-encoder',
    name: 'Backslash Encoder',
    show: false,
    Component: BackSlashCodec,
  },
];

const Main = () => {
  const [allRoutes, setAllRoutes] = useState<MenuItem[]>([]);
  const [routes, setRoutes] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState('');
  const [editMenu, setEditMenu] = useState(false);
  const [activeMenuItemPath, setActiveMenuItemPath] = useState('');
  const [activeMenuItemName, setActiveMenuItemName] = useState('');
  const history = useHistory();
  const location = useLocation();

  const handleSearch = (e: { target: { value: string } }) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (search.trim()) {
      setRoutes(
        allRoutes.filter(({ name }) => name.match(new RegExp(search, 'gi')))
      );
    } else if (editMenu) {
      setRoutes(allRoutes);
    } else {
      setRoutes(allRoutes.filter((r) => r.show));
    }
  }, [search, editMenu]);

  useEffect(() => {
    const routeMap: Record<string, boolean> = allRoutes.reduce(
      (a, b) => ({ ...a, [b.path]: b.show }),
      {}
    );
    setRoutes(allRoutes.filter((r) => editMenu || routeMap[r.path]));

    if (allRoutes.length) {
      ipcRenderer.invoke('set-store', { key: 'left-menu', value: routeMap });
    }
  }, [allRoutes]);

  useEffect(() => {
    setActiveMenuItemPath('');
  }, [location]);

  useEffect(() => {
    const routeMap: Record<string, boolean> = defaultRoutes.reduce(
      (a, b) => ({ ...a, [b.path]: b.show }),
      {}
    );
    ipcRenderer
      .invoke('get-store', { key: 'left-menu' })
      .then((map) => {
        if (map) {
          const routeList = defaultRoutes.map((r) => ({
            ...r,
            show:
              map[r.path] === true || map[r.path] === false
                ? map[r.path]
                : routeMap[r.path],
          }));
          setAllRoutes(routeList);
        } else {
          setAllRoutes(defaultRoutes);
        }
        return null;
      })
      .catch(console.error);

    ipcRenderer.on('hotkey-pressed', () => {
      history.push('/auto', { auto: true });
    });
  }, []);

  const handleAddNewMenuItem = () => {
    const id = uuidv4();
    const routeList = [
      ...allRoutes,
      {
        icon: <FontAwesomeIcon icon="slash" transform={{ rotate: 42 }} />,
        path: `/custom-script-${id}`,
        name: `Custom Script ${id.slice(0, 5)}`,
        show: true,
        Component: CustomScript,
      },
    ];
    setAllRoutes(routeList);
  };

  const handleSaveMenuItemEdit = () => {
    setAllRoutes(
      allRoutes.map((r) =>
        r.path === activeMenuItemPath ? { ...r, name: activeMenuItemName } : r
      )
    );
    setActiveMenuItemPath('');
    setActiveMenuItemName('');
  };

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <main className="relative flex flex-1 min-h-0">
        {/* Left sidebar */}
        <nav className="flex flex-col flex-shrink-0 w-1/4 overflow-x-hidden overflow-y-auto bg-gray-300">
          {/* Search */}
          <div className="flex items-center justify-between px-2 mx-3 mt-6 text-gray-400 bg-gray-200 rounded-md focus-within:text-gray-600 focus-within:ring-2 focus-within:ring-blue-500">
            <FontAwesomeIcon icon="search" className="mr-1" />
            <input
              type="text"
              className="w-full p-1 bg-gray-200 border-none rounded-r-md focus:ring-0"
              value={search}
              onChange={handleSearch}
              placeholder="Search..."
            />
            {search && (
              <FontAwesomeIcon
                icon="times-circle"
                onClick={() => setSearch('')}
                className="mr-2 cursor-pointer"
              />
            )}
            <FontAwesomeIcon
              icon={editMenu ? 'check' : 'sliders-h'}
              onClick={() => {
                setEditMenu(!editMenu);
                if (editMenu) handleSaveMenuItemEdit();
              }}
              className={classNames({
                'text-gray-400 cursor-pointer hover:text-gray-600': true,
                'text-blue-500 hover:text-blue-600': editMenu,
              })}
            />
          </div>

          <div
            className="px-2 my-6"
            role="menu"
            aria-orientation="horizontal"
            aria-labelledby="options-menu"
          >
            {routes.map(({ path, name, icon, show }) => (
              <section
                key={path}
                className="flex items-center justify-between space-x-2"
              >
                {(activeMenuItemPath === path && (
                  <input
                    className="flex items-center justify-start flex-1 px-3 py-1 mb-1 space-x-1 rounded-lg"
                    value={activeMenuItemName}
                    onChange={(evt) => {
                      setActiveMenuItemName(evt.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveMenuItemEdit();
                      }
                    }}
                  />
                )) || (
                  <NavLink
                    to={path}
                    className="flex items-center justify-start flex-1 px-3 py-1 mb-1 space-x-1 rounded-lg"
                    activeClassName="bg-blue-400 text-white"
                  >
                    <span className="w-6">{icon}</span>
                    {name}
                  </NavLink>
                )}
                {editMenu && (
                  <>
                    {location.pathname === path && path.startsWith('/custom-') && (
                      <>
                        {(!activeMenuItemPath && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuItemPath(path);
                              setActiveMenuItemName(name);
                            }}
                            className="w-10 btn"
                          >
                            edit
                          </button>
                        )) || (
                          <button
                            type="button"
                            onClick={() => {
                              setAllRoutes(
                                allRoutes.filter(
                                  (r) => r.path !== activeMenuItemPath
                                )
                              );
                              setActiveMenuItemPath('');
                              setActiveMenuItemName('');
                            }}
                            className="w-12 btn text-white bg-red-500"
                          >
                            x
                          </button>
                        )}
                      </>
                    )}
                    <input
                      type="checkbox"
                      checked={show}
                      onChange={() =>
                        setAllRoutes(
                          allRoutes.map((r) =>
                            r.path === path ? { ...r, show: !show } : r
                          )
                        )
                      }
                      className="w-4 h-4 rounded cursor-pointer"
                    />
                  </>
                )}
              </section>
            ))}
            {editMenu && (
              <button
                type="button"
                className="btn"
                onClick={handleAddNewMenuItem}
              >
                + Add your script
              </button>
            )}
          </div>
        </nav>

        {/* Main content */}
        <section className="relative flex flex-col w-3/4 bg-gray-200">
          <div className="h-full px-6 my-6 overflow-x-hidden overflow-y-auto">
            {allRoutes.map(({ path, name, Component }) => (
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
