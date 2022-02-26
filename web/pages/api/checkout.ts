import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { axiosClient } from '../../lib/axiosClient';
import { IGetGameResponse } from '../../lib/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      if (!req.body.gameId) {
        throw new Error('Missing Game Name');
      }
      const gameId = req.body.gameId;
      const { data } = await axiosClient.get<IGetGameResponse>(
        `/games/${gameId}`
      );
      if (!data.game) {
        throw new Error('Game not found');
      }
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            amount: data.game.price * 100,
            currency: 'inr',
            quantity: 1,
            images: data.game.images,
            name: data.game.name,
            description: `Buying ${data.game.name} for ${data.game.price}`,
          },
        ],
        payment_intent_data: {
          description: `Bought ${data.game.name} for ${data.game.price} INR`,
          metadata: {
            product: 'EGAMES STORE PRODUCTS',
            game: data.game.name,
            gameId: data.game.id,
            price: data.game.price,
          },
        },
        mode: 'payment',
        success_url: `${req.headers.origin}/game/${gameId}?success=true`,
        cancel_url: `${req.headers.origin}/game/${gameId}?canceled=true`,
      });

      if (session.status === 'complete') {
        await axiosClient.post(`/games/${gameId}/purchase`, {
          sessionId: session.id,
          amount: session.amount_total,
          status: session.status,
        });
      }

      res.redirect(303, session.url!);
    } catch (err: any) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
