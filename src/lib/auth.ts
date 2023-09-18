import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import {redirect} from 'next/navigation';

export async function isLoggedIn(){
    const session = await getServerSession(authOptions)
    if (session) {
        // console.log('user is logged in ')
    }
    else {
        // console.log('user is not logged in')
        redirect('/api/auth/signin')
    }



}