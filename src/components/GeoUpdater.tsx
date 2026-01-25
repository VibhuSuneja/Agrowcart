'use client'
import { getSocket } from '@/lib/socket'
import React, { useEffect } from 'react'

function GeoUpdater({ userId }: { userId: string }) {
  let socket = getSocket()
  socket.emit("identity", userId)
  useEffect(() => {
    if (!userId) return
    if (!navigator.geolocation) return
    const watcher = navigator.geolocation.watchPosition((pos) => {
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      socket.emit("update-location", {
        userId,
        latitude: lat,
        longitude: lon
      })
    }, (err) => {
      console.error("Geolocation error:", err)
      if (err.code === 1) {
        console.warn("Location permission denied. Please enable location access in your browser settings.")
      } else if (err.code === 2) {
        console.warn("Unable to determine location. Please check your device settings.")
      } else if (err.code === 3) {
        console.warn("Location request timed out.")
      }
    }, { enableHighAccuracy: true })
    return () => navigator.geolocation.clearWatch(watcher)

  }, [userId])
  return null
}

export default GeoUpdater
