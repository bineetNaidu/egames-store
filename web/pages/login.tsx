import { Input, Button } from '@nextui-org/react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';

const Login: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex h-full flex-col justify-center items-center text-white mt-16">
        <div>
          <h2 className="text-purple-400">Welcome Back!</h2>
          <h1 className="text-5xl my-2 font-semibold">
            Login in to Your Account <span className="text-purple-600">.</span>
          </h1>
          <div className="flex">
            <h2 className="text-purple-400">Dont have an account?</h2>
            <Link href="/register">
              <a className="text-blue-200 ml-2 underline">Register</a>
            </Link>
          </div>

          <div className="flex flex-col my-8 gap-y-12">
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
