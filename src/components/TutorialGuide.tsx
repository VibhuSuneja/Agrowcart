'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight, X, Sparkles, HelpCircle } from 'lucide-react'

export interface TourStep {
    targetId: string;
    title: string;
    content: string;
}

interface TutorialGuideProps {
    steps: TourStep[];
    tourName: string; // Used for localStorage to prevent repeating
}

export default function TutorialGuide({ steps, tourName }: TutorialGuideProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

    useEffect(() => {
        const hasSeenTour = localStorage.getItem(`tour_${tourName}`)
        if (!hasSeenTour) {
            // Delay start slightly to allow dashboard to render
            const timer = setTimeout(() => setIsVisible(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [tourName])

    useEffect(() => {
        let animationFrameId: number;

        const updatePosition = () => {
            if (!isVisible) return

            const element = document.getElementById(steps[currentStep].targetId)
            if (element) {
                const newRect = element.getBoundingClientRect()

                // Only update state if position/size actually changed to prevent render thrashing
                setTargetRect(prev => {
                    if (!prev) return newRect;
                    if (
                        Math.abs(prev.top - newRect.top) < 1 &&
                        Math.abs(prev.left - newRect.left) < 1 &&
                        Math.abs(prev.width - newRect.width) < 1 &&
                        Math.abs(prev.height - newRect.height) < 1
                    ) {
                        return prev;
                    }
                    return newRect;
                })
            }
            animationFrameId = requestAnimationFrame(updatePosition)
        }

        if (isVisible) {
            // Initial scroll to target
            const element = document.getElementById(steps[currentStep].targetId)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
            // Start the tracking loop
            updatePosition()
        }

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId)
        }
    }, [isVisible, currentStep, steps])

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            handleComplete()
        }
    }

    const handleComplete = () => {
        setIsVisible(false)
        localStorage.setItem(`tour_${tourName}`, 'true')
    }

    if (!isVisible || !targetRect) return null

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            {/* Backdrop with Hole */}
            <div
                className="absolute inset-0 bg-black/60 transition-all duration-500"
                style={{
                    clipPath: `polygon(
                        0% 0%, 0% 100%, 
                        ${targetRect.left - 10}px 100%, 
                        ${targetRect.left - 10}px ${targetRect.top - 10}px, 
                        ${targetRect.right + 10}px ${targetRect.top - 10}px, 
                        ${targetRect.right + 10}px ${targetRect.bottom + 10}px, 
                        ${targetRect.left - 10}px ${targetRect.bottom + 10}px, 
                        ${targetRect.left - 10}px 100%, 
                        100% 100%, 100% 0%
                    )`
                }}
            />

            {/* Glowing Border around target */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                    position: 'absolute',
                    top: targetRect.top - 10,
                    left: targetRect.left - 10,
                    width: targetRect.width + 20,
                    height: targetRect.height + 20,
                    border: '3px solid #16a34a',
                    borderRadius: '1rem',
                    boxShadow: '0 0 20px rgba(22, 163, 74, 0.4)',
                    pointerEvents: 'none'
                }}
                className="animate-pulse"
            />

            {/* Content Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                style={{
                    position: 'absolute',
                    top: (() => {
                        const tooltipHeight = 260
                        let topPos = targetRect.bottom + 30 > window.innerHeight - 250 ? targetRect.top - tooltipHeight : targetRect.bottom + 30

                        // Safety check: if tooltip would be off-screen top (negative) or under navbar, 
                        // force it to be inside the element near the top
                        if (topPos < 100) {
                            topPos = Math.max(120, targetRect.top + 20)
                        }
                        return topPos
                    })(),
                    left: Math.min(Math.max(20, targetRect.left), window.innerWidth - 340),
                    width: '320px'
                }}
                className="bg-white rounded-[2rem] p-8 shadow-2xl pointer-events-auto border border-zinc-100"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full">
                        <Sparkles size={14} className="animate-spin-slow" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Interactive Guide</span>
                    </div>
                    <button onClick={handleComplete} className="text-zinc-400 hover:text-zinc-600">
                        <X size={18} />
                    </button>
                </div>

                <h4 className="text-xl font-black text-zinc-900 mb-3 tracking-tighter">
                    {steps[currentStep].title}
                </h4>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-8">
                    {steps[currentStep].content}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all ${idx === currentStep ? 'w-6 bg-green-600' : 'w-1.5 bg-zinc-200'}`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase hover:bg-green-600 transition-all group"
                    >
                        {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
