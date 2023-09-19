// 'use client';
import PriceCard from "@/components/priceCard";
import { createCustomer, hasSubscription, checkOutLink, stripe } from "@/lib/stripe";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { PrismaClient } from '@prisma/client';

import { useState } from 'react';
const prisma = new PrismaClient();

export default async function Page() {
    const customer = await createCustomer();
    const hasSub = await hasSubscription();
    const checkoutLink = await checkOutLink(String(customer));
    // link to subscribe
    const session = await getServerSession(authOptions);
    const user = await prisma.user.findFirst({
        where: { email: session?.user?.email },
    });
    const top10logs = await prisma.log.findMany(
        {
            where: {
                userId: user?.id
            },
            orderBy: {
                Created: 'desc'
            },
            take: 10
        }
    )
    let currentUsage = 0;

    if (hasSub) {

        const subscriptions = await stripe.subscriptions.list({
            customer: String(user?.stripe_customer_id),
        });


        const invoice = await stripe.invoices.retrieveUpcoming({
            subscription: subscriptions.data.at(0)?.id,
        });
        currentUsage = invoice.amount_due
    }


    return (
        <main >
            {/* <p>Dashboard</p> */}
            {/* <PriceCard/> */}
            {/* <>
            <form  onSubmit={handleSubmit}>
                <button className="font-medium text-sm text-white bg-black px-4 py-2 rounded-lg hover:opacity-70" type="submit">subscribe</button>
            </form>
            </> */}

            {
                hasSub ? <>
                    <div className="  rounded-md px-4 py-2 bg-emerald-400 text-white  font-medium text-sm w-full mb-3">
                        <p>subscribed</p>
                    </div>
                    <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-md">
                        <p className="text-sm text-black px-6 py-6 font-medium"> CURRENT USAGE</p>
                        <p className="text-sm font-mono text-zinc-800 px-6 py-8"> {currentUsage / 100}</p>

                    </div>
                    <br />
                    <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-md">
                        <p className="text-sm text-black px-6 py-6 font-medium"> API KEY</p>
                        <div className="flex items-center gap-4 justify-between">
                            <p className="text-sm font-mono text-zinc-800 px-6 py-8"> {user?.api_key}</p>
                            <Link className="text-sm font-mono  px-6 py-8 bg-black rounded-sm text-white hover:opacity-70" href={'/api/endpoint/?api_key=' + user?.api_key}> checkout</Link>

                        </div>

                    </div>
                    {/*  */}
                    <br />
                    <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-md">
                        <p className="text-sm text-black px-6 py-6 font-medium"> LOG events</p>
                        {
                            top10logs?.map((item, index) => (
                                <div className="flex items-center gap-4" key={index}>
                                    <p className="text-sm font-mono text-zinc-800 px-6 py-8">{item.method}</p>
                                    <p className="text-sm font-mono text-zinc-800 px-6 py-8">{item.status}</p>
                                    <p className="text-sm font-mono text-zinc-800 px-6 py-8">{item.Created.toDateString()}</p>
                                </div>
                            ))

                        }

                    </div>


                </> :
                    <>
                        <div className="min-h-[60vh] grid place-items-center rounded-lg px-6 py-10 bg-slate-100">

                            <Link
                                href={String(checkoutLink)}
                                className='font-medium text-base hover:opacity-60 hover:underline'>
                                you have no subscriptions, checkout now!
                            </Link>

                        </div>
                    </>
            }

        </main >
    )
}