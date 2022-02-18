import Link from 'next/link';
import { FC, useCallback } from 'react';
import {
  Avatar,
  Grid,
  Row,
  Col,
  Card,
  Text,
  Tooltip,
  Link as NextUILink,
  Button,
} from '@nextui-org/react';
import { useUserStore } from '../lib/store/user.store';
import { removeAccessTokenInCookie } from '../lib/utils';

export const AuthCard: FC = () => {
  const { authUser, removeAuthUser } = useUserStore();

  const handleLogout = useCallback(() => {
    removeAccessTokenInCookie();
    removeAuthUser();
    window.location.href = '/';
  }, [removeAuthUser]);

  const Dropdown: FC = () => {
    return (
      <Card css={{ marginTop: '-2rem' }}>
        <Row>
          <Link href="/my-reviews" passHref>
            <NextUILink block>My Reviews</NextUILink>
          </Link>
        </Row>
        <Row css={{ my: '$3' }}>
          <Link href="/my-games" passHref>
            <NextUILink block>My Purchases</NextUILink>
          </Link>
        </Row>
        <Row>
          <Button size="xs" color="gradient" onClick={handleLogout}>
            Logout
          </Button>
        </Row>
      </Card>
    );
  };

  return (
    <Tooltip
      trigger="click"
      content={<Dropdown />}
      placement="bottom"
      contentColor="warning"
    >
      <Card animated clickable css={{ width: 'fit-content' }} shadow>
        <Grid>
          <Row>
            <Col>
              <Avatar
                size="lg"
                src={authUser!.avatar}
                color="gradient"
                bordered
              />
            </Col>
            <Col>
              <Text
                color="white"
                css={{
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  lineHeight: '1.5rem',
                  marginLeft: '1rem',
                  pt: '0.7rem',
                }}
              >
                {authUser!.username}
              </Text>
            </Col>
          </Row>
        </Grid>
      </Card>
    </Tooltip>
  );
};
