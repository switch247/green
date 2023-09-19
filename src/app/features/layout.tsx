import { Header } from "@/components/header";


export default async function FeaturesLayout({ children }: { children: React.ReactNode }) {

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