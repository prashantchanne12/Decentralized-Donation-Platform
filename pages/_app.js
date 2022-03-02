import '../styles/globals.css';
import { MantineProvider } from '@mantine/core';

import Header from '../components/Header';

function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider
      theme={{
        fontFamily: 'Arial',
        colors: {
          brand: [
            '#faf5ff',
            '#f3e8ff',
            '#e9d5ff',
            '#d8b4fe',
            '#c084fc',
            '#a855f7',
            '#9333ea',
            '#7e22ce',
            '#6b21a8',
            '#581c87',
          ],
        },
        primaryColor: 'brand',
      }}
    >
      <Header />
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default MyApp;
