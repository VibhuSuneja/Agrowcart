'use client'

import dynamic from 'next/dynamic'

const GlobalChatBot = dynamic(() => import("./GlobalChatBot"), {
    ssr: false,
})

export default function ClientGlobalChatBot() {
    return <GlobalChatBot />
}
