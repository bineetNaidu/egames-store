import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Container, NextUIProvider, createTheme } from '@nextui-org/react';
import { Navbar } from '../components/Navbar';

function MyApp({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    type: 'white',
    theme: {
      colors: {
        background: '#10075c',
        text: 'rgb(191 219 254 / 1)',
        textPrimary: 'rgb(192 132 252 / 1)',
        textPrimaryDeep: 'rgb(147 51 234 / 1)',
        link: 'rgb(191 219 254 / 1)',
      },
    },
  });

  return (
    <>
      <NextUIProvider theme={theme}>
        <Container css={{ h: '100%', minHeight: '100vh' }}>
          <Navbar />
          <Component {...pageProps} />
        </Container>
      </NextUIProvider>
    </>
  );
}

export default MyApp;
