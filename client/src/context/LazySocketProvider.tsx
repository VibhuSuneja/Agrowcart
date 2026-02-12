'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const SocketProvider = dynamic(
    () => import('./SocketContext').then((mod) => mod.SocketProvider),
    { ssr: false }
)

export const LazySocketProvider = ({ children }: { children: React.ReactNode }) => {
    return <SocketProvider>{children}</SocketProvider>
}
