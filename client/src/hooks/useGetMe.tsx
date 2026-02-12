'use client'

import { AppDispatch } from '@/redux/store'
import { setUserData } from '@/redux/userSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'

function useGetMe(enabled: boolean) {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (!enabled) return // ✅ SAFE

    let cancelled = false

    const getMe = async () => {
      try {
        const result = await axios.get('/api/me')
        if (!cancelled) {
          if (result.data.isBanned) {
            toast.error("Your account has been deactivated by administration.")
            signOut({ callbackUrl: "/login?error=account_banned" })
            return
          }
          dispatch(setUserData(result.data))
        }
      } catch (error) {
        console.error('GET ME FAILED:', error)
      }
    }

    getMe()

    return () => {
      cancelled = true
    }
  }, [enabled, dispatch])
}

export default useGetMe
