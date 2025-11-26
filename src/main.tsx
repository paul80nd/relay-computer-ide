import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './app.tsx';
import { FluentProvider, webDarkTheme, webLightTheme } from '@fluentui/react-components';
import './workers.ts';

// eslint-disable-next-line react-refresh/only-export-components
const AppRoot = () => {
  const [theme, setTheme] = useState(webDarkTheme);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? webDarkTheme : webLightTheme);
    };

    // Initial theme
    setTheme(mediaQuery.matches ? webDarkTheme : webLightTheme);

    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  return (
    <FluentProvider theme={theme}>
      <App />
    </FluentProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
);
