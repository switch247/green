import { Header } from '@/components/header'
import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })
const popins = Poppins({ subsets: ['latin'], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] })

export const metadata: Metadata = {
  title: 'Saas Next App',
  description: 'Generated switch247',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    <html lang="en">
      <body className={popins.className}>
        {/* <Header /> */}
        {children}
        
      </body>
    </html>
  )
}
