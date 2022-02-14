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
import styles from '../styles/register.module.css';
import { Formik, Form } from 'formik';
import { sleep } from '../lib/utils';
import { IAuthResponse, IRegisterBody } from '../lib/types';
import { axiosClient } from '../lib/axiosClient';
import { setAccessTokenInCookie } from '../lib/utils';
import { useUserStore } from '../lib/store/user.store';
import { useToasts } from 'react-toast-notifications';

const Register: NextPage = () => {
  const { setAuthUser } = useUserStore();
  const { addToast } = useToasts();

  const handleRegister = async (values: IRegisterBody) => {
    // validate values
    if (
      !(values.email && values.password && values.username && values.avatar)
    ) {
      addToast('Please fill all fields', {
        appearance: 'error',
        autoDismiss: true,
      });
      return [];
    }
    const res = await axiosClient.post<IAuthResponse>('/auth/register', values);
    const { accessToken, user, errors } = res.data;
    if (accessToken) {
      setAccessTokenInCookie(accessToken);
      setAuthUser(user!);
      addToast('Successfully registered', {
        appearance: 'success',
        autoDismiss: true,
      });
      window.location.href = '/';
    }

    return errors || [];
  };

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

          <Formik
            initialValues={{
              email: '',
              password: '',
              username: '',
              avatar: '',
            }}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
              try {
                setSubmitting(true);
                await sleep(2000);
                const errors = await handleRegister(values);
                if (errors.length) {
                  const fmtErr = errors.map(({ message, field }) => ({
                    [field]: message,
                  }));
                  setErrors(fmtErr as any);
                } else {
                  setSubmitting(false);
                }
              } catch (e) {
                console.log(`Error: ${(e as Error).message}`);
              }
            }}
          >
            {({ getFieldProps, isSubmitting }) => (
              <Form>
                <div className={styles.register__form}>
                  <Input
                    bordered
                    clearable
                    helperText="Required."
                    helperColor="success"
                    required
                    labelPlaceholder="Username"
                    color="secondary"
                    {...getFieldProps('username')}
                  />
                  <Input
                    bordered
                    clearable
                    helperText="Required."
                    helperColor="success"
                    required
                    labelPlaceholder="Email"
                    color="secondary"
                    {...getFieldProps('email')}
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
                    {...getFieldProps('password')}
                  />
                  <Input
                    bordered
                    clearable
                    helperText="Required."
                    helperColor="success"
                    required
                    labelPlaceholder="Avatar"
                    color="secondary"
                    {...getFieldProps('avatar')}
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
                      <Text>Register!</Text>
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

export default Register;
