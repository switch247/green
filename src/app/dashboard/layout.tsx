import { Header } from "@/components/header";
import { isLoggedIn } from "@/lib/auth";
import { createCustomer, hasSubscription, checkOutLink } from "@/lib/stripe";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { hasSubscribers } from "diagnostics_channel";
import { getServerSession } from "next-auth";
// import { redirect } from "next/dist/server/api-utils";
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function DashBoardLayout({ children }: { children: React.ReactNode }) {
    await isLoggedIn();
    // const customer = await createCustomer();
    // const hasSub = await hasSubscription();
    // console.log(hasSub ? 'yes' : 'no')
    
    
    // const users = await prisma.user.findMany();
    // console.log("users:",users)
    
    
    // console.log(customer)
    // const checkoutLink = await checkOutLink(String(customer));
    // console.log(checkoutLink)

    return (
        <div className="">
            <Header />
            <div className="max-w-5xl m-auto w-full px-4">
            {/* flex items-center  justify-center */}
                {children}
            </div>

        </div>
    )
}