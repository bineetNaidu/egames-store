import { Input, Button } from '@nextui-org/react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';

const Register: NextPage = () => {
  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <div className="flex h-full flex-col justify-center items-center text-white mt-16">
        <div>
          <h2 className="text-purple-400">Start For Free</h2>
          <h1 className="text-5xl my-2 font-semibold">
            Create New Account <span className="text-purple-600">.</span>
          </h1>
          <div className="flex">
            <h2 className="text-purple-400">Already have an account?</h2>
            <Link href="/login">
              <a className="text-blue-200 ml-2 underline">Login</a>
            </Link>
          </div>

          <div className="flex flex-col my-8 gap-y-12">
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
