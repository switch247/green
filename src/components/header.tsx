import Link from "next/link"

export function Header() {
    return(
    <nav className="max-w-5xs m-auto w-full px-4">
        <div className="flex items-center gap-8 justify-between py-4">
            <Link href={'/'} className="text-2xl font-semibold text-black hover:opacity-70">
                LOGO
            </Link>
        
        <div className="flex gap-4 items-center">
            <Link href={'/features'}className="font-medium text-sm text-black hover:opacity-70" >
                Features
            </Link>
            <Link href={'/pricing'} className="font-medium text-sm text-black hover:opacity-70">
                Pricing
            </Link>
            <Link href={'/dashboard'} className="font-medium text-sm text-white bg-black px-4 py-2 rounded-lg hover:opacity-70">
                Dashboard
            </Link>
        </div>
        </div>
    </nav>
    );

}