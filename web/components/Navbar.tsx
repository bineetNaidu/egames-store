import { FC } from 'react';
import Link from 'next/link';
import { Text, Container, Input, Button } from '@nextui-org/react';
import styles from '../styles/Navbar.module.css';
import { useUserStore } from '../lib/store/user.store';
import { AuthCard } from './AuthCard';

export const Navbar: FC = () => {
  const { isAuthenticated } = useUserStore();
  return (
    <Container
      fluid
      as="nav"
      css={{
        my: '2rem',
        d: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <Link href="/" passHref>
          <Text
            h2
            color="white"
            css={{
              fontWeight: 'bold',
              fontSize: '2.25rem',
              lineHeight: '2.5rem',
              cursor: 'pointer',
            }}
          >
            E Games Store
          </Text>
        </Link>
      </div>

      <div>
        <Input
          bordered
          labelPlaceholder="Search"
          size="md"
          clearable
          color="secondary"
        />
      </div>

      <div className={styles.navbar_ctx}>
        {isAuthenticated ? (
          <AuthCard />
        ) : (
          <>
            <Link href="/login" passHref>
              <Button rounded color="gradient" auto>
                Login
              </Button>
            </Link>

            <Link href="/register" passHref>
              <Button rounded color="gradient" auto>
                Register
              </Button>
            </Link>
          </>
        )}
      </div>
    </Container>
  );
};
