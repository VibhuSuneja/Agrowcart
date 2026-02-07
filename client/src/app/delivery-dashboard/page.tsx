'use client'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import DeliveryBoyDashboard from '@/components/DeliveryBoyDashboard'

function DeliveryDashboardPage() {
    const { userData } = useSelector((state: RootState) => state.user)

    // Role-based access control
    if (userData && userData.role !== 'deliveryBoy') {
        redirect('/')
    }

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
