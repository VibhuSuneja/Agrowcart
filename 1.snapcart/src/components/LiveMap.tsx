import React, { useEffect, useState } from 'react'
interface ILocation {
    latitude: number,
    longitude: number
}
interface Iprops {
    userLocation: ILocation
    deliveryBoyLocation: ILocation
    children?: React.ReactNode
}
import L, { LatLngExpression } from "leaflet"
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import { LocateFixed } from "lucide-react"

function Recenter({ positions }: { positions: [number, number] }) {
    const map = useMap()
    useEffect(() => {
        if (positions[0] !== 0 && positions[1] !== 0) {
            map.setView(positions, map.getZoom(), {
                animate: true
            })
        }
    }, [positions, map])
    return null
}

function MapEvents({ setMap }: { setMap: (map: L.Map) => void }) {
    const map = useMap()
    useEffect(() => {
        setMap(map)
    }, [map, setMap])
    return null
}

function LiveMap({ userLocation, deliveryBoyLocation, children }: Iprops) {
    const [map, setMap] = useState<L.Map | null>(null)

    const deliveryBoyIcon = L.divIcon({
        className: 'bg-transparent',
        html: `<div style="background-color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #16a34a; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
    })

    const userIcon = L.divIcon({
        className: 'bg-transparent',
        html: `<div style="background-color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #2563eb; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
    })

    const linePositions =
        deliveryBoyLocation && userLocation && deliveryBoyLocation.latitude !== 0 && userLocation.latitude !== 0
            ? [
                [userLocation.latitude, userLocation.longitude],
                [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]

            ] : []
    const center = deliveryBoyLocation && deliveryBoyLocation.latitude !== 0
        ? [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]
        : (userLocation.latitude !== 0 ? [userLocation.latitude, userLocation.longitude] : [20.5937, 78.9629]); // Default to India center if both 0


    return (
        <div className="space-y-4">
            <div className='w-full h-[500px] rounded-xl overflow-hidden shadow-lg border border-zinc-100 z-0'>
                <MapContainer center={center as any} zoom={13} scrollWheelZoom={true} className="w-full h-full">
                    <MapEvents setMap={setMap} />
                    <Recenter positions={center as any} />
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {userLocation.latitude !== 0 && (
                        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
                            <Popup>Delivery Address</Popup>
                        </Marker>
                    )}

                    {deliveryBoyLocation && deliveryBoyLocation.latitude !== 0 && (
                        <Marker position={[deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]} icon={deliveryBoyIcon}>
                            <Popup>Delivery Partner</Popup>
                        </Marker>
                    )}

                    <Polyline positions={linePositions as any} color='green' weight={4} dashArray="10, 10" />
                </MapContainer>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2">
                <div className="w-full md:w-auto order-2 md:order-1">
                    {children}
                </div>
                <button
                    className="bg-white text-green-700 px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm shadow-md border border-zinc-100 hover:bg-green-50 transition-all active:scale-95 whitespace-nowrap order-1 md:order-2 self-end"
                    onClick={(e) => {
                        e.preventDefault();
                        map?.flyTo(center as any, 15)
                    }}
                >
                    <LocateFixed size={18} />
                    <span>Recenter View</span>
                </button>
            </div>
        </div>
    )
}

export default LiveMap
