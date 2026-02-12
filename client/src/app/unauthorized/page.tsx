import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Access Denied',
  description: 'You do not have permission to access this page on AgrowCart.',
}

function Unauthorized() {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <h1 className='text-3xl font-bold text-red-600'>Access Denied 🚫</h1>
      <p className='mt-2 text-gray-700'>You can not access this page.</p>
    </div>
  )
}

export default Unauthorized
