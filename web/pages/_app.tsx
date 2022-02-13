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
