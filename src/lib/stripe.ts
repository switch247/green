import Stripe from 'stripe';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { subscribe } from 'diagnostics_channel';
import { randomUUID } from 'crypto';
const prisma = new PrismaClient();
// price_1Nr2gXLvKtE8zT0Qc1fWelbc    standard
export const stripe = new Stripe(String(process.env.STRIPE_SECRET), {
  apiVersion: '2023-08-16',
});

export async function hasSubscription() {
  const session = await getServerSession(authOptions);
  if (session) {
    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email,
      },
    });

    const subscriptions = await stripe.subscriptions.list({
      customer: String(user?.stripe_customer_id),
    });

    return subscriptions.data.length > 0;
  } //session end
}

export async function checkOutLink(customerId: any) {
  const checkout = await stripe.checkout.sessions.create({
    success_url: 'http://localhost:3000/dashboard/billing?success=true', // Specify the URL to redirect to after successful payment
    cancel_url: 'http://localhost:3000/dashboard/billing?cancel=true', // Specify the URL to redirect to if the payment is canceled
    customer: customerId,
    line_items: [
      {
        // this contains the subscription plan id we got from product in stripe
        // standard
        price: 'price_1Nr2gXLvKtE8zT0Qc1fWelbc',
      },
    ],
    mode: 'subscription',
  });
  return checkout.url;
}

export const createCustomer = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    const user = await prisma.user.findFirst({
      where: { email: session.user?.email },
    });
    // console.log("user:",user);
    if (!user?.api_key) {
      await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          api_key: 'apiKey_' + randomUUID(),
        },
      });
    }
    if (!user?.stripe_customer_id) {
      const params: Stripe.CustomerCreateParams = {
        email: String(user?.email),
        description: 'test customer',
      };
      try {
        const customer: Stripe.Customer = await stripe.customers.create(params);

        //   console.log(customer.id);
        //   update the user by adding the customer id from stripe db to the user in our postgress db
        await prisma.user.update({
          where: {
            id: user?.id,
          },
          data: {
            stripe_customer_id: customer.id,
            //   api_key:'apiKey_'+randomUUID,
          },
        });
      } catch (error) {
        console.log({ error: error });
      }

      //   refetch user after updating
      const user2 = await prisma.user.findFirst({
        where: { email: session.user?.email },
      });
      return user2?.stripe_customer_id;
    } else {
      //  if user already exists
      const user2 = await prisma.user.findFirst({
        where: { email: session.user?.email },
      });
      return user2?.stripe_customer_id;
    }
  }
};
// clmm2n8re0000jgsc697ixrnv
