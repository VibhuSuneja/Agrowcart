import { Metadata } from 'next'
import { auth } from '@/auth'
import AdminDashboard from '@/components/AdminDashboard'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your personalized AgrowCart dashboard. Manage orders, view AI-powered crop insights, and connect directly with the millet ecosystem.',
  openGraph: {
    title: 'Dashboard | AgrowCart',
    description: 'Your personalized AgrowCart dashboard. Manage orders, view AI-powered crop insights, and connect directly with the millet ecosystem.',
  },
}
import DeliveryBoy from '@/components/DeliveryBoy'
import EditRoleMobile from '@/components/EditRoleMobile'
import Footer from '@/components/Footer'
import GeoUpdater from '@/components/GeoUpdater'

import Nav from '@/components/Nav'
import UserDashboard from '@/components/UserDashboard'
import connectDb from '@/lib/db'
import Product, { IProduct } from '@/models/product.model'

import User from '@/models/user.model'

import { redirect } from 'next/navigation'



async function Home(props: {
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

  const inComplete = !user.role || (user.role !== "admin" && !user.mobile)
  if (inComplete) {
    return <EditRoleMobile />
  }

  const plainUser = JSON.parse(JSON.stringify(user))

  let productList: IProduct[] = []

  if (user.role === "user") {
    if (searchParams.q) {
      const products = await Product.find({
        $or: [
          { name: { $regex: searchParams?.q || "", $options: "i" } },
          { category: { $regex: searchParams?.q || "", $options: "i" } },
        ]
      })
      productList = JSON.parse(JSON.stringify(products))
    } else {
      const products = await Product.find({})
      productList = JSON.parse(JSON.stringify(products))
    }
  }




  return (
    <>
      <Nav user={plainUser} />
      <GeoUpdater userId={plainUser._id} />
      {user.role == "user" ? (
        <UserDashboard productList={productList} />
      ) : user.role == "admin" ? (
        <AdminDashboard />
      ) : user.role == "deliveryBoy" ? (
        <DeliveryBoy />
      ) : user.role == "farmer" ? (
        redirect("/farmer-dashboard")
      ) : user.role == "shg" ? (
        redirect("/shg-dashboard")
      ) : user.role == "processor" ? (
        redirect("/processor-dashboard")
      ) : user.role == "buyer" ? (
        redirect("/buyer-marketplace")
      ) : user.role == "startup" ? (
        redirect("/startup-dashboard")
      ) : (
        <UserDashboard productList={productList} /> // Default fallback
      )}
      <Footer />
    </>
  )
}

export default Home
