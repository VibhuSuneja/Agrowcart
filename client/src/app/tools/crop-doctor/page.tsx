'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Loader2, Sprout, AlertCircle, CheckCircle, ArrowLeft, X } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function CropDoctorPage() {
    const router = useRouter();
    const { userData } = useSelector((state: RootState) => state.user)
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const analyzeCrop = async () => {
        if (!image) return;

        setLoading(true);
        try {
            // Convert image to base64
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onloadend = async () => {
                const base64data = reader.result as string;

                // Call the API (we'll implement a specific public route for this)
                const response = await fetch('/api/ai/crop-doctor-public', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64data }),
                });

                const data = await response.json();
                setResult(data);
                setLoading(false);
            };
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            <Nav user={userData || { name: "Guest", email: "", role: "user" }} />

            <div className="pt-32 pb-20 px-4">
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-3 text-zinc-500 hover:text-green-600 font-bold mb-8 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center group-hover:bg-green-50 group-hover:rotate-[-10deg] transition-all">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="text-sm uppercase tracking-widest">Back to Dashboard</span>
                    </button>

                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-green-200"
                        >
                            <Sprout size={32} />
                        </motion.div>
                        <h1 className="text-4xl font-black text-gray-900 mb-4">
                            AI Crop Doctor <span className="text-green-600">Free</span>
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Upload a photo of your sick millet crop. Our Gemini AI will diagnose the disease and suggest remedies instantly.
                        </p>
                    </div>

                    <div className="ultra-glass p-8 md:p-12 rounded-[3.5rem] relative overflow-hidden transition-all duration-700">
                        {/* High-tech Background Decorations */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                        {!preview ? (
                            <label className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-[2.5rem] cursor-pointer hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group relative overflow-hidden">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_center,_var(--alpha-primary)_0%,_transparent_70%)]" style={{ '--alpha-primary': 'rgba(22, 163, 74, 0.05)' } as any} />
                                <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:rotate-[10deg] transition-all duration-500 shadow-inner">
                                    <Upload size={32} />
                                </div>
                                <p className="text-zinc-800 dark:text-zinc-200 font-black text-lg tracking-tight">Click to upload crop photo</p>
                                <p className="text-xs text-zinc-400 mt-2 font-bold uppercase tracking-widest">Supports JPG, PNG (Max 5MB)</p>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        ) : (
                            <div className="relative rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl border border-white/20 group bg-zinc-950/5 dark:bg-zinc-950/40 min-h-[350px] flex items-center justify-center">
                                <img src={preview} alt="Crop Preview" className="max-w-full max-h-[550px] object-contain transition-transform duration-700 group-hover:scale-105" />

                                {/* Neuro-Scan Animation */}
                                {loading && (
                                    <>
                                        <motion.div
                                            initial={{ top: '0%' }}
                                            animate={{ top: '100%' }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/80 to-transparent z-10 shadow-[0_0_20px_rgba(22,163,74,0.8)]"
                                        />
                                        <div className="absolute inset-0 bg-primary/5 animate-pulse z-0" />
                                        <div className="absolute inset-0 flex items-center justify-center z-20">
                                            <div className="bg-zinc-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-3">
                                                <Loader2 className="animate-spin text-primary" size={20} />
                                                <span className="text-white text-xs font-black uppercase tracking-[0.2em]">Neural Processing...</span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (loading) return;
                                        setPreview(null);
                                        setImage(null);
                                        setResult(null);
                                    }}
                                    className="absolute top-6 right-6 z-[9999] bg-white/90 dark:bg-zinc-900/90 p-3 rounded-2xl text-red-500 hover:text-white hover:bg-red-500 shadow-2xl border border-red-100 dark:border-white/10 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                                    title="Remove image"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )}

                        {preview && !result && !loading && (
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={analyzeCrop}
                                className="w-full py-5 bg-zinc-900 dark:bg-primary text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                            >
                                <Sprout size={24} />
                                Diagnose Disease
                            </motion.button>
                        )}

                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-10 space-y-8"
                            >
                                <div className={`p-8 rounded-[2.5rem] border-2 relative overflow-hidden ${result.isHealthy ? 'bg-green-50/50 border-green-200/50 dark:bg-green-500/5 dark:border-green-500/20' : 'bg-red-50/50 border-red-200/50 dark:bg-red-500/5 dark:border-red-500/20'}`}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`p-3 rounded-2xl ${result.isHealthy ? 'bg-green-500 text-white' : 'bg-red-500 text-white shadow-lg shadow-red-500/20'}`}>
                                            {result.isHealthy ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">AI Diagnosis</div>
                                            <h3 className="text-2xl font-black text-zinc-900 dark:text-white leading-tight">{result.diagnosis}</h3>
                                        </div>
                                    </div>
                                    <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">{result.description}</p>
                                </div>

                                {!result.isHealthy && (
                                    <div className="bg-amber-500/5 dark:bg-amber-500/10 rounded-[2.5rem] p-8 border-2 border-amber-500/20 relative overflow-hidden">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                                            <h4 className="font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest text-sm">Recommended Treatment</h4>
                                        </div>
                                        <ul className="space-y-4">
                                            {result.treatments.map((t: string, i: number) => (
                                                <motion.li
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 * i }}
                                                    key={i}
                                                    className="flex items-start gap-3 bg-white/40 dark:bg-white/5 p-4 rounded-xl border border-amber-500/10"
                                                >
                                                    <div className="w-5 h-5 rounded-full bg-amber-500 flex-shrink-0 flex items-center justify-center text-white text-[10px] font-black">{i + 1}</div>
                                                    <span className="text-amber-900 dark:text-amber-100 font-bold text-sm leading-relaxed">{t}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="bg-linear-to-br from-indigo-600 to-blue-800 rounded-[2.5rem] p-10 text-white text-center shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                                    <p className="font-black text-2xl mb-3 tracking-tighter">Ready to sell your healthy harvest?</p>
                                    <p className="text-indigo-100/80 mb-8 text-sm font-medium">Join 5000+ farmers getting 15% better rates on AgrowCart's AI-Optimized marketplace.</p>
                                    <Link href="/register" className="inline-flex items-center justify-center bg-white text-indigo-700 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-xl">
                                        Create Seller Account
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
