import {
  Input,
  Button,
  Text,
  Link as NextUILink,
  Loading,
} from '@nextui-org/react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/login.module.css';
import { IAuthResponse, ILoginBody } from '../lib/types';
import { setAccessTokenInCookie, sleep } from '../lib/utils';
import { axiosClient } from '../lib/axiosClient';
import { useToasts } from 'react-toast-notifications';
import { Formik, Form } from 'formik';

const Login: NextPage = () => {
  const { addToast } = useToasts();

  const handleLogin = async (values: ILoginBody) => {
    if (!(values.email && values.password)) {
      addToast('Please fill all fields', {
        appearance: 'error',
        autoDismiss: true,
      });
      return [];
    }
    const res = await axiosClient.post<IAuthResponse>('/auth/login', values);
    const { accessToken, errors } = res.data;
    if (accessToken) {
      setAccessTokenInCookie(accessToken);
      addToast('Successfully Logged into Your Account', {
        appearance: 'success',
        autoDismiss: true,
        onDismiss: () => {
          window.location.href = '/';
        },
      });
    }
    return errors || [];
  };

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

          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setSubmitting(true);
                await sleep(2000);
                const errors = await handleLogin(values);

                if (errors.length) {
                  throw new Error(JSON.stringify(errors));
                } else {
                  setSubmitting(false);
                }
              } catch (e) {
                const err = JSON.parse(JSON.stringify(e)) as any;
                let msg = 'Something went wrong';

                if (err.status === 401) {
                  msg = 'Invalid password';
                } else if (err.status === 404) {
                  msg = 'User was not found with this ' + values.email;
                }

                addToast(msg, {
                  appearance: 'error',
                  autoDismiss: true,
                });
                console.log(`Error: ${msg}`);
              }
            }}
          >
            {({ getFieldProps, isSubmitting }) => (
              <Form>
                <div className={styles.login__form}>
                  <Input
                    labelLeft="email"
                    underlined
                    color="secondary"
                    clearable
                    type="email"
                    {...getFieldProps('email')}
                    helperText="Required."
                    helperColor="success"
                  />
                  <Input.Password
                    clearable
                    required
                    underlined
                    labelLeft="password"
                    {...getFieldProps('password')}
                    helperText="Required."
                    helperColor="success"
                    type="password"
                    color="secondary"
                  />

                  <Button
                    color="gradient"
                    auto
                    type="submit"
                    clickable={!isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loading color="white" size="sm" />
                    ) : (
                      <Text>Login!</Text>
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Login;
