import { Input, Button, Text, Link as NextUILink } from '@nextui-org/react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/login.module.css';

const Login: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className={styles.login}>
        <div>
          <Text
            h4
            css={{
              color: '$textPrimary',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            Welcome Back!
          </Text>
          <Text
            h1
            css={{
              color: '$white',
              fontSize: '3rem',
              lineHeight: 1,
              fontWeight: '$bold',
              my: '0.5rem',
            }}
          >
            Login to your account{' '}
            <Text span css={{ color: '$textPrimaryDeep' }}>
              .
            </Text>
          </Text>
          <div className="flex">
            <Text h5 css={{ color: '$textPrimary' }}>
              Don&apos;t have an account?
            </Text>
            <Link href="/register" passHref>
              <NextUILink
                className="text-blue-200 ml-2 underline"
                animated
                css={{
                  color: '$link',
                  textDecoration: 'underline',
                  ml: '0.5rem',
                }}
              >
                Register
              </NextUILink>
            </Link>
          </div>

          <div className={styles.login__form}>
            <Input
              labelLeft="username"
              underlined
              color="secondary"
              clearable
              helperText="Required."
              helperColor="success"
            />
            <Input.Password
              clearable
              required
              underlined
              labelLeft="password"
              helperText="Required."
              helperColor="success"
              type="password"
              color="secondary"
            />

            <Button color="gradient" auto>
              Login!
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
