import { Text } from '@nextui-org/react';
import type { GetServerSideProps, NextPage } from 'next';
import { axiosClient } from '../lib/axiosClient';
import { COOKIE_TOKEN_NAME } from '../lib/constant';
import { initializeUserStore } from '../lib/store/user.store';
import { IAuthResponse } from '../lib/types';

const Home: NextPage = () => {
  return (
    <div>
      <Text>Hello E Games Store</Text>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const userStore = initializeUserStore();
  const authCookie = ctx.req.headers.cookie
    ?.split(';')
    .find((c) => c.trim().startsWith(`${COOKIE_TOKEN_NAME}=`));
  const token = authCookie?.split('=')[1];
  const { data } = await axiosClient.get<IAuthResponse>('/auth/profile', {
    headers: {
      'x-access-token': token || '',
    },
  });
  if (data.user) {
    userStore.getState().setAuthUser(data.user);
  }
  return {
    props: {
      initialUserStore: JSON.parse(JSON.stringify(userStore.getState())),
    },
  };
};
export default Home;
