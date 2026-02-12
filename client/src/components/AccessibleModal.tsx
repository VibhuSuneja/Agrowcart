'use client'
import React, { useEffect, useRef, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'

interface AccessibleModalProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    title?: string
    className?: string
    showCloseButton?: boolean
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function AccessibleModal({
    isOpen,
    onClose,
    children,
    title,
    className = '',
    showCloseButton = true
}: AccessibleModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const previousFocusRef = useRef<HTMLElement | null>(null)

    // Store the trigger element when the modal opens
    useEffect(() => {
        if (isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement
            // Prevent body scroll
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
            // Return focus to the trigger element
            setTimeout(() => {
                previousFocusRef.current?.focus()
            }, 0)
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    // Focus the first focusable element inside the modal after animation
    useEffect(() => {
        if (!isOpen) return
        const timer = setTimeout(() => {
            const container = contentRef.current
            if (!container) return
            const first = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
            if (first) {
                first.focus()
            } else {
                // Fallback: make the container itself focusable
                container.setAttribute('tabindex', '-1')
                container.focus()
            }
        }, 150) // Wait for framer-motion animation to start
        return () => clearTimeout(timer)
    }, [isOpen])

    // Handle Escape and Tab keys
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
            e.preventDefault()
            e.stopPropagation()
            onClose()
            return
        }

        if (e.key === 'Tab') {
            const container = contentRef.current
            if (!container) return

            const focusableElements = Array.from(
                container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
            )

            if (focusableElements.length === 0) {
                e.preventDefault()
                return
            }

            const firstElement = focusableElements[0]
            const lastElement = focusableElements[focusableElements.length - 1]
            const activeEl = document.activeElement

            if (e.shiftKey) {
                if (activeEl === firstElement || !container.contains(activeEl)) {
                    e.preventDefault()
                    lastElement.focus()
                }
            } else {
                if (activeEl === lastElement || !container.contains(activeEl)) {
                    e.preventDefault()
                    firstElement.focus()
                }
            }
        }
    }, [onClose])

    // Also listen at document level for Escape as a safety net
    useEffect(() => {
        if (!isOpen) return
        const handleDocEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault()
                onClose()
            }
        }
        document.addEventListener('keydown', handleDocEsc)
        return () => document.removeEventListener('keydown', handleDocEsc)
    }, [isOpen, onClose])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={overlayRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                    onKeyDown={handleKeyDown}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={title ? "accessible-modal-title" : undefined}
                    tabIndex={-1}
                >
                    <motion.div
                        ref={contentRef}
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className={`bg-white dark:bg-zinc-900 w-full max-w-md rounded-[2.5rem] shadow-2xl relative ${className}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all z-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        )}

                        {title && (
                            <h2 id="accessible-modal-title" className="sr-only">
                                {title}
                            </h2>
                        )}

                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
