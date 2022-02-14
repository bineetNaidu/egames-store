import { FC } from 'react';
import Link from 'next/link';
import { Text, Container, Input, Button } from '@nextui-org/react';

export const Navbar: FC = () => {
  return (
    <Container as="nav" className="my-8 flex justify-between items-center">
      <div>
        <Text h2 color="white" className="text-4xl font-bold">
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

      <div className="flex gap-2">
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
      </div>
    </Container>
  );
};
