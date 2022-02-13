import { FC } from 'react';
import { Text, Container, Input, Button } from '@nextui-org/react';

export const Navbar: FC = () => {
  return (
    <Container
      as="nav"
      css={{
        my: '0.8rem',
        d: 'flex',
        jc: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <Text h2 color="white">
          E Games Store
        </Text>
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

      <div className="flex">
        <Button rounded color="gradient" auto>
          Login
        </Button>

        <Button rounded color="gradient" auto>
          Register
        </Button>
      </div>
    </Container>
  );
};
