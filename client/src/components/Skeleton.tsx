import React from 'react';
import { motion } from 'motion/react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'rect' | 'circle';
}

const Skeleton = ({ className = '', variant = 'rect' }: SkeletonProps) => {
    let baseStyles = 'bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden';

    if (variant === 'circle') baseStyles += ' rounded-full';
    else if (variant === 'text') baseStyles += ' rounded h-4 w-full';
    else baseStyles += ' rounded-2xl';

    return (
        <div className={`${baseStyles} ${className}`}>
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: 'linear',
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
            />
        </div>
    );
};

export const CardSkeleton = () => (
    <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-8 border border-zinc-100 dark:border-white/5 shadow-xl shadow-zinc-900/5 space-y-6">
        <Skeleton variant="rect" className="h-56 w-full rounded-[2.5rem]" />
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <Skeleton variant="text" className="w-2/3 h-8" />
                <Skeleton variant="text" className="w-1/4 h-8" />
            </div>
            <Skeleton variant="text" className="w-1/2" />
        </div>
        <div className="flex gap-4">
            <Skeleton variant="rect" className="h-14 flex-1 rounded-2xl" />
            <Skeleton variant="rect" className="h-14 w-14 rounded-2xl" />
        </div>
    </div>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
    <div className="space-y-4">
        {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
                <Skeleton variant="circle" className="w-12 h-12" />
                <div className="flex-1 space-y-2">
                    <Skeleton variant="text" />
                    <Skeleton variant="text" className="w-3/4" />
                </div>
            </div>
        ))}
    </div>
);

export default Skeleton;
