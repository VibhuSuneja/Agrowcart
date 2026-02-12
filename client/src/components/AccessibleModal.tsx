'use client'
import React, { useEffect, useRef, ReactNode } from 'react'
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

export default function AccessibleModal({
    isOpen,
    onClose,
    children,
    title,
    className = '',
    showCloseButton = true
}: AccessibleModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const previousFocusRef = useRef<HTMLElement | null>(null)
    const firstFocusableRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        if (isOpen) {
            // Store the element that had focus before modal opened
            previousFocusRef.current = document.activeElement as HTMLElement

            // Focus the first focusable element in modal after a short delay
            setTimeout(() => {
                const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                )
                if (focusableElements && focusableElements.length > 0) {
                    firstFocusableRef.current = focusableElements[0]
                    focusableElements[0].focus()
                }
            }, 100)
        } else {
            // Return focus to the element that opened the modal
            if (previousFocusRef.current) {
                previousFocusRef.current.focus()
            }
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            // Close on Escape key
            if (e.key === 'Escape') {
                e.preventDefault()
                onClose()
                return
            }

            // Trap focus within modal on Tab
            if (e.key === 'Tab') {
                const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                )

                if (!focusableElements || focusableElements.length === 0) return

                const firstElement = focusableElements[0]
                const lastElement = focusableElements[focusableElements.length - 1]

                if (e.shiftKey) {
                    // Shift + Tab: if on first element, go to last
                    if (document.activeElement === firstElement) {
                        e.preventDefault()
                        lastElement.focus()
                    }
                } else {
                    // Tab: if on last element, go to first
                    if (document.activeElement === lastElement) {
                        e.preventDefault()
                        firstElement.focus()
                    }
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={title ? "modal-title" : undefined}
                >
                    <motion.div
                        ref={modalRef}
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className={`bg-white dark:bg-zinc-900 w-full max-w-md rounded-[2.5rem] shadow-2xl relative ${className}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all z-10"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        )}

                        {title && (
                            <h2 id="modal-title" className="sr-only">
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
