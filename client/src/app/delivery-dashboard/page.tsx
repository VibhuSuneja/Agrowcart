'use client'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import DeliveryBoyDashboard from '@/components/DeliveryBoyDashboard'

function DeliveryDashboardPage() {
    const router = useRouter()
    const { userData } = useSelector((state: RootState) => state.user)

    // Role-based access control
    React.useEffect(() => {
        if (userData && userData.role !== 'deliveryBoy') {
            router.push('/')
            toast.error("Access Denied: Logistics clearance required", {
                icon: '🚫',
                style: {
                    borderRadius: '1rem',
                    background: '#18181b',
                    color: '#fff',
                    border: '1px solid #ef4444'
                }
            })
        }
    }, [userData, router])

    return (
        <div className="min-h-screen bg-zinc-50">
            <Nav user={userData} />
            <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
                <DeliveryBoyDashboard earning={0} />
            </main>
            <Footer />
        </div>
    )
}

export default DeliveryDashboardPage
