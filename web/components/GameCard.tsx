import { Card, Row, Col, Text, Button } from '@nextui-org/react';
import Link from 'next/link';
import { FC } from 'react';
import { Game } from '../lib/types';

interface GameCardProps {
  game: Game;
}

export const GameCard: FC<GameCardProps> = ({ game }) => {
  return (
    <Card cover css={{ w: '100%' }}>
      <Card.Header
        css={{
          position: 'absolute',
          zIndex: 1,
          top: 0,
          bgBlur: '#ffffff',
          borderBottom: '$borderWeights$light solid rgba(255, 255, 255, 0.2)',
          borderTopLeftRadius: '$base',
          borderTopRightRadius: '$base',
        }}
      >
        <Col>
          <Text h4 css={{ color: '$blue900', fontWeight: '$medium' }}>
            {game.name}
          </Text>
        </Col>
      </Card.Header>
      <Card.Body>
        <Card.Image
          src={game.thumbnail}
          height={400}
          width="100%"
          alt="Card example background"
        />
      </Card.Body>
      <Card.Footer
        blur
        css={{
          position: 'absolute',
          bgBlur: '#ffffff',
          borderTop: '$borderWeights$light solid rgba(255, 255, 255, 0.2)',
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Row>
          <Col
            css={{
              pt: '0.2rem',
            }}
          >
            <Text h4 css={{ color: '$blue900', fontWeight: '$medium' }}>
              ${game.price}
            </Text>
          </Col>
          <Col>
            <Row justify="flex-end">
              <Link href={`/game/${game.id}`} passHref>
                <Button flat auto rounded color="secondary">
                  <Text
                    css={{ color: '$blue900' }}
                    size={12}
                    weight="bold"
                    transform="uppercase"
                  >
                    BUY
                  </Text>
                </Button>
              </Link>
            </Row>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};
