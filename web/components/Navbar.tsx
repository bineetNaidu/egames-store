import { FC, ChangeEvent, useState } from 'react';
import Link from 'next/link';
import {
  Text,
  Container,
  Input,
  Button,
  FormElement,
  Card,
  Col,
  Image,
  Row,
} from '@nextui-org/react';
import styles from '../styles/Navbar.module.css';
import { useUserStore } from '../lib/store/user.store';
import { AuthCard } from './AuthCard';
import Fuse from 'fuse.js';
import { useGameStore } from '../lib/store/games.store';
import { Game } from '../lib/types';

export const Navbar: FC = () => {
  const { isAuthenticated } = useUserStore();
  const [searchResults, setSearchResults] = useState<Fuse.FuseResult<Game>[]>(
    []
  );
  const games = useGameStore((state) => state.games);
  const fuse = new Fuse(games, {
    keys: ['name'],
    threshold: 0.3,
  });

  const handleSearch = (e: ChangeEvent<FormElement>) => {
    const value = e.target.value;
    if (value.length === 0) {
      setSearchResults([]);
      return;
    }
    const results = fuse.search(value);
    setSearchResults(results);
    console.log(searchResults);
  };
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

      <div style={{ position: 'relative' }}>
        <Input
          bordered
          labelPlaceholder="Search"
          size="md"
          clearable
          color="secondary"
          onChange={handleSearch}
        />
        {searchResults.length > 0 && (
          <Card
            css={{
              position: 'absolute',
              top: '104%',
              left: 0,
              right: 0,
              zIndex: 10,
              borderRadius: '0 0 0.5rem 0.5rem',
              boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)',
              overflowY: 'auto',
            }}
          >
            {searchResults.map((result) => (
              <Link
                href={`/game/${result.item.id}`}
                key={result.item.id}
                passHref
              >
                <Button
                  ghost
                  color="gradient"
                  bordered
                  animated
                  auto
                  css={{
                    my: '0.5rem',
                  }}
                >
                  <Row
                    align="center"
                    css={{
                      py: '0.5rem',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.item.thumbnail}
                      height="80px"
                      width="60px"
                      alt={result.item.name}
                    />
                    <Text b color="white" css={{ ml: '$5' }}>
                      {result.item.name}
                    </Text>
                  </Row>
                </Button>
              </Link>
            ))}
          </Card>
        )}
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
