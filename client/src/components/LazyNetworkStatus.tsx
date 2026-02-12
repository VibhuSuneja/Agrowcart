'use client'

import dynamic from 'next/dynamic'

const NetworkStatus = dynamic(() => import('./NetworkStatus'), { ssr: false })

export default function LazyNetworkStatus() {
    return <NetworkStatus />
}
