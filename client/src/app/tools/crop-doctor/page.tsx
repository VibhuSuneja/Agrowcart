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

                    <div className="bg-white rounded-3xl shadow-xl shadow-green-900/5 p-8 border border-green-100">
                        {!preview ? (
                            <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-green-200 rounded-2xl cursor-pointer hover:bg-green-50 transition-colors group">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                                    <Upload size={24} />
                                </div>
                                <p className="text-gray-500 font-medium">Click to upload crop photo</p>
                                <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG (Max 5MB)</p>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        ) : (
                            <div className="relative rounded-2xl overflow-hidden mb-6 shadow-lg border border-zinc-100 group h-64">
                                <img src={preview} alt="Crop Preview" className="w-full h-full object-cover" />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setPreview(null);
                                        setImage(null);
                                        setResult(null);
                                    }}
                                    className="absolute top-4 right-4 z-[9999] bg-white/90 p-2 rounded-full text-red-500 hover:text-red-700 shadow-xl border border-red-100 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                                    title="Remove image"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )}

                        {preview && !result && (
                            <button
                                onClick={analyzeCrop}
                                disabled={loading}
                                className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Diagnose Disease'}
                            </button>
                        )}

                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 space-y-6"
                            >
                                <div className={`p-4 rounded-xl border ${result.isHealthy ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        {result.isHealthy ? <CheckCircle className="text-green-600" /> : <AlertCircle className="text-red-600" />}
                                        <h3 className="text-xl font-bold text-gray-900">{result.diagnosis}</h3>
                                    </div>
                                    <p className="text-gray-700">{result.description}</p>
                                </div>

                                {!result.isHealthy && (
                                    <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                                        <h4 className="font-bold text-amber-900 mb-3 uppercase tracking-wider text-sm">Recommended Treatment</h4>
                                        <ul className="list-disc list-inside space-y-2 text-amber-900/80">
                                            {result.treatments.map((t: string, i: number) => (
                                                <li key={i}>{t}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="bg-indigo-600 rounded-xl p-6 text-white text-center shadow-lg shadow-indigo-200">
                                    <p className="font-bold text-lg mb-2">Sell your 100% Healthy Crops?</p>
                                    <p className="text-indigo-100 mb-4 text-sm">Join 5000+ farmers getting 15% better rates on AgrowCart.</p>
                                    <a href="/register" className="inline-block bg-white text-indigo-700 px-6 py-2 rounded-full font-bold hover:bg-indigo-50 transition-colors">
                                        Create Seller Account
                                    </a>
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
