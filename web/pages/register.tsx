import { Input, Button, Text, Link as NextUILink } from '@nextui-org/react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/register.module.css';

const Register: NextPage = () => {
  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <div className={styles.register}>
        <div>
          <Text
            h4
            css={{
              color: '$textPrimary',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            Start For Free
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
            Create New Account{' '}
            <Text span css={{ color: '$textPrimaryDeep' }}>
              .
            </Text>
          </Text>
          <div className="flex">
            <Text h5 css={{ color: '$textPrimary' }}>
              Already have an account?
            </Text>
            <Link href="/login" passHref>
              <NextUILink
                className="text-blue-200 ml-2 underline"
                animated
                css={{
                  color: '$link',
                  textDecoration: 'underline',
                  ml: '0.5rem',
                }}
              >
                Login
              </NextUILink>
            </Link>
          </div>

          <div className={styles.register__form}>
            <Input
              bordered
              clearable
              helperText="Required."
              helperColor="success"
              required
              labelPlaceholder="Username"
              color="secondary"
            />
            <Input
              bordered
              clearable
              helperText="Required."
              helperColor="success"
              required
              labelPlaceholder="Email"
              color="secondary"
            />
            <Input.Password
              bordered
              clearable
              helperText="Required."
              helperColor="success"
              required
              labelPlaceholder="Password"
              type="password"
              color="secondary"
            />
            <Input
              bordered
              clearable
              helperText="Required."
              helperColor="success"
              required
              labelPlaceholder="Avatar"
              color="secondary"
            />
            <Button color="gradient" auto>
              Register!
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
