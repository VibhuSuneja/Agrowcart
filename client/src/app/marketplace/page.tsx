import { auth } from '@/auth'
import Footer from '@/components/Footer'
import GeoUpdater from '@/components/GeoUpdater'
import Nav from '@/components/Nav'
import UserDashboard from '@/components/UserDashboard'
import connectDb from '@/lib/db'
import Product, { IProduct } from '@/models/product.model'
import User from '@/models/user.model'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Marketplace | Smart Millet Sourcing',
    description: 'Browse fresh, organic millets directly from verified farmers. AI-powered pricing and quality assurance for every harvest.',
}

export default async function Marketplace(props: {
    searchParams: Promise<{
        q: string
    }>
}) {

    const searchParams = await props.searchParams
    await connectDb()
    const session = await auth()
    if (!session) redirect("/login")

    const user = await User.findById(session?.user?.id)
    if (!user) redirect("/login")

    const plainUser = JSON.parse(JSON.stringify(user))

    let productList: IProduct[] = []

    if (searchParams.q) {
        productList = await Product.find({
            $or: [
                { name: { $regex: searchParams?.q || "", $options: "i" } },
                { category: { $regex: searchParams?.q || "", $options: "i" } },
            ]
        })
    } else {
        productList = await Product.find({})
    }

    return (
        <>
            <Nav user={plainUser} />
            <GeoUpdater userId={plainUser._id} />
            <UserDashboard productList={productList} />
            <Footer />
        </>
    )
}
