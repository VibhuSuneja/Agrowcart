'use client'
import React, { useEffect, useState } from 'react'
import L from "leaflet"
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import { LocateFixed, Truck, Map as MapIcon } from "lucide-react"

interface ILocation {
    latitude: number,
    longitude: number
}

interface IDeliveryPartner {
    id: string
    name: string
    location: ILocation
    activeOrderCount: number
}

interface IProps {
    partners: IDeliveryPartner[]
}

function Recenter({ partners }: { partners: IDeliveryPartner[] }) {
    const map = useMap()
    useEffect(() => {
        if (partners.length > 0) {
            const bounds = L.latLngBounds(partners.map(p => [p.location.latitude, p.location.longitude]))
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 })
        }
    }, [partners, map])
    return null
}

const LogisticsGlobalMap = ({ partners }: IProps) => {
    const deliveryBoyIcon = L.divIcon({
        className: 'bg-transparent',
        html: `<div style="background-color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #16a34a; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
    })

    const center = partners.length > 0
        ? [partners[0].location.latitude, partners[0].location.longitude]
        : [20.5937, 78.9629]

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-[3rem] p-8 border border-zinc-100 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white">
                            <MapIcon size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Logistics Overview</h2>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                {partners.length} Active Partners Online
                            </p>
                        </div>
                    </div>
                </div>

                <div className='w-full h-[400px] rounded-[2rem] overflow-hidden border border-zinc-100 z-0'>
                    <MapContainer center={center as any} zoom={5} scrollWheelZoom={true} className="w-full h-full">
                        <Recenter partners={partners} />
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {partners.map(partner => (
                            <Marker
                                key={partner.id}
                                position={[partner.location.latitude, partner.location.longitude]}
                                icon={deliveryBoyIcon}
                            >
                                <Popup>
                                    <div className="p-2">
                                        <p className="font-black text-sm">{partner.name}</p>
                                        <p className="text-xs text-zinc-500">Active Missions: {partner.activeOrderCount}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    )
}

export default LogisticsGlobalMap
