'use client'
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Plus, ChefHat, Clock, Flame, Upload, Sparkles, Video, Mic, MicOff, Wand2, Loader2, Square } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface CreateRecipeModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    userName: string
    initialData?: any
}

export default function CreateRecipeModal({ isOpen, onClose, onSuccess, userName, initialData }: CreateRecipeModalProps) {
    const [loading, setLoading] = useState(false)
    const [aiLoading, setAiLoading] = useState<string | null>(null)
    const [isRecording, setIsRecording] = useState(false)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        video: '',
        audioNote: '',
        timeToCook: '',
        difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
        ingredients: [''],
        instructions: [''],
        tags: ['']
    })

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                image: initialData.image || '',
                video: initialData.video || '',
                audioNote: initialData.audioNote || '',
                timeToCook: initialData.timeToCook || '',
                difficulty: initialData.difficulty || 'Easy',
                ingredients: initialData.ingredients?.length ? initialData.ingredients : [''],
                instructions: initialData.instructions?.length ? initialData.instructions : [''],
                tags: initialData.tags?.length ? initialData.tags : ['']
            })
        } else {
            resetForm()
        }
    }, [initialData, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title || !formData.description || !formData.timeToCook) {
            toast.error('Please fill in all required fields')
            return
        }

        setLoading(true)
        try {
            // If there's an audio blob, we'd upload it to Cloudinary here
            // For now, using the URL field directly

            if (initialData && initialData.id) {
                // Update existing recipe
                await axios.put(`/api/recipes/${initialData.id}`, {
                    ...formData,
                    ingredients: formData.ingredients.filter(i => i.trim()),
                    instructions: formData.instructions.filter(i => i.trim()),
                    tags: formData.tags.filter(t => t.trim())
                })
                toast.success('Recipe updated successfully! ✨')
            } else {
                // Create new recipe
                await axios.post('/api/recipes', {
                    ...formData,
                    chef: userName || 'Anonymous Chef',
                    image: formData.image || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
                    ingredients: formData.ingredients.filter(i => i.trim()),
                    instructions: formData.instructions.filter(i => i.trim()),
                    tags: formData.tags.filter(t => t.trim()),
                    likes: 0,
                    likedBy: []
                })
                toast.success('Recipe shared successfully! 🎉')
            }
            onSuccess()
            onClose()
            resetForm()
        } catch (error) {
            toast.error(initialData ? 'Failed to update recipe' : 'Failed to share recipe')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            image: '',
            video: '',
            audioNote: '',
            timeToCook: '',
            difficulty: 'Easy',
            ingredients: [''],
            instructions: [''],
            tags: ['']
        })
        setAudioBlob(null)
    }

    const addField = (field: 'ingredients' | 'instructions' | 'tags') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }))
    }

    const updateField = (field: 'ingredients' | 'instructions' | 'tags', index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }))
    }

    const removeField = (field: 'ingredients' | 'instructions' | 'tags', index: number) => {
        if (formData[field].length > 1) {
            setFormData(prev => ({
                ...prev,
                [field]: prev[field].filter((_, i) => i !== index)
            }))
        }
    }

    // AI Assistance functions
    const aiAssist = async (action: string) => {
        if (!formData.title && action !== 'full_recipe') {
            toast.error('Please enter a title first')
            return
        }

        setAiLoading(action)
        try {
            const res = await axios.post('/api/ai/recipe-assist', {
                action,
                data: {
                    title: formData.title,
                    description: formData.description,
                    ingredients: formData.ingredients.filter(i => i.trim())
                }
            })

            const result = res.data.result

            switch (action) {
                case 'improve_title':
                    setFormData(prev => ({ ...prev, title: result }))
                    toast.success('Title improved! ✨')
                    break
                case 'improve_description':
                    setFormData(prev => ({ ...prev, description: result }))
                    toast.success('Description improved! ✨')
                    break
                case 'suggest_ingredients':
                    if (Array.isArray(result)) {
                        setFormData(prev => ({ ...prev, ingredients: result }))
                        toast.success('Ingredients generated! 🥗')
                    }
                    break
                case 'suggest_instructions':
                    if (Array.isArray(result)) {
                        setFormData(prev => ({ ...prev, instructions: result }))
                        toast.success('Instructions generated! 📝')
                    }
                    break
                case 'suggest_tags':
                    if (Array.isArray(result)) {
                        setFormData(prev => ({ ...prev, tags: result }))
                        toast.success('Tags suggested! 🏷️')
                    }
                    break
                case 'full_recipe':
                    if (typeof result === 'object') {
                        setFormData(prev => ({
                            ...prev,
                            title: result.title || prev.title,
                            description: result.description || prev.description,
                            timeToCook: result.timeToCook || prev.timeToCook,
                            difficulty: result.difficulty || prev.difficulty,
                            ingredients: result.ingredients || prev.ingredients,
                            instructions: result.instructions || prev.instructions,
                            tags: result.tags || prev.tags
                        }))
                        toast.success('Full recipe generated! 🎉')
                    }
                    break
            }
        } catch (error: any) {
            console.error('AI Assist Error:', error?.response?.data || error)
            const errorMsg = error?.response?.data?.message || error?.response?.data?.error || 'AI assistance failed. Check console for details.'
            toast.error(errorMsg)
        } finally {
            setAiLoading(null)
        }
    }

    // Audio Recording functions
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            audioChunksRef.current = []

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data)
            }

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
                setAudioBlob(audioBlob)
                // In production, upload to Cloudinary and get URL
                // For now, create a local URL
                const audioUrl = URL.createObjectURL(audioBlob)
                setFormData(prev => ({ ...prev, audioNote: audioUrl }))
                stream.getTracks().forEach(track => track.stop())
            }

            mediaRecorder.start()
            setIsRecording(true)
            toast.success('Recording started! 🎤')
        } catch (error) {
            toast.error('Microphone access denied')
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            toast.success('Audio note saved! 🎵')
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-8 py-6 border-b border-zinc-100 flex items-center justify-between z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                                    <ChefHat className="text-white w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-zinc-900">{initialData ? 'Edit Recipe' : 'Share Your Recipe'}</h2>
                                    <p className="text-zinc-400 text-sm">{initialData ? 'Update your masterpiece' : 'AI-powered recipe creation'}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center hover:bg-zinc-200 transition">
                                <X className="w-5 h-5 text-zinc-600" />
                            </button>
                        </div>

                        {/* AI Magic Button */}
                        <div className="px-8 pt-6">
                            <button
                                type="button"
                                onClick={() => aiAssist('full_recipe')}
                                disabled={!formData.title || aiLoading !== null}
                                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-purple-600/25 hover:shadow-2xl hover:shadow-purple-600/40 transition-all disabled:opacity-50 group"
                            >
                                {aiLoading === 'full_recipe' ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                                )}
                                <span>✨ Generate Full Recipe with AI</span>
                            </button>
                            <p className="text-center text-xs text-zinc-400 mt-2">Enter a title, then click to auto-generate everything!</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Title with AI */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Recipe Title *</label>
                                    <button
                                        type="button"
                                        onClick={() => aiAssist('improve_title')}
                                        disabled={aiLoading !== null}
                                        className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:text-purple-700 disabled:opacity-50"
                                    >
                                        {aiLoading === 'improve_title' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                                        Improve with AI
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="e.g., Crispy Ragi Dosa"
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition font-medium"
                                    required
                                />
                            </div>

                            {/* Description with AI */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Description *</label>
                                    <button
                                        type="button"
                                        onClick={() => aiAssist('improve_description')}
                                        disabled={aiLoading !== null}
                                        className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:text-purple-700 disabled:opacity-50"
                                    >
                                        {aiLoading === 'improve_description' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                                        Improve with AI
                                    </button>
                                </div>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Share the story behind your recipe..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition font-medium resize-none"
                                    required
                                />
                            </div>

                            {/* Media Section */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Image URL */}
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                                        <Upload className="w-3 h-3 inline mr-1" /> Image URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                        placeholder="https://..."
                                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition text-sm"
                                    />
                                </div>

                                {/* Video URL */}
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                                        <Video className="w-3 h-3 inline mr-1" /> Short Video URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.video}
                                        onChange={e => setFormData(prev => ({ ...prev, video: e.target.value }))}
                                        placeholder="https://..."
                                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition text-sm"
                                    />
                                </div>
                            </div>

                            {/* Audio Note Recording */}
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                                    🎤 Audio Note
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={isRecording ? stopRecording : startRecording}
                                        className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${isRecording
                                            ? 'bg-red-500 text-white animate-pulse'
                                            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                                            }`}
                                    >
                                        {isRecording ? (
                                            <>
                                                <Square className="w-4 h-4" />
                                                Stop Recording
                                            </>
                                        ) : (
                                            <>
                                                <Mic className="w-4 h-4" />
                                                Record Audio Note
                                            </>
                                        )}
                                    </button>
                                    {audioBlob && (
                                        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-bold">
                                            ✓ Audio saved
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-zinc-400 mt-1">Share cooking tips, pronunciation, or your story!</p>
                            </div>

                            {/* Time & Difficulty */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                                        <Clock className="w-3 h-3 inline mr-1" /> Cook Time *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.timeToCook}
                                        onChange={e => setFormData(prev => ({ ...prev, timeToCook: e.target.value }))}
                                        placeholder="e.g., 30 mins"
                                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition font-medium"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                                        <Flame className="w-3 h-3 inline mr-1" /> Difficulty *
                                    </label>
                                    <select
                                        value={formData.difficulty}
                                        onChange={e => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' }))}
                                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition font-medium"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                            </div>

                            {/* Ingredients with AI */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Ingredients</label>
                                    <button
                                        type="button"
                                        onClick={() => aiAssist('suggest_ingredients')}
                                        disabled={aiLoading !== null}
                                        className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:text-purple-700 disabled:opacity-50"
                                    >
                                        {aiLoading === 'suggest_ingredients' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                        AI Generate
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.ingredients.map((ingredient, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={ingredient}
                                                onChange={e => updateField('ingredients', i, e.target.value)}
                                                placeholder={`Ingredient ${i + 1}`}
                                                className="flex-1 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition text-sm"
                                            />
                                            {formData.ingredients.length > 1 && (
                                                <button type="button" onClick={() => removeField('ingredients', i)} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addField('ingredients')} className="text-green-600 text-sm font-bold flex items-center gap-1 hover:text-green-700">
                                        <Plus className="w-4 h-4" /> Add Ingredient
                                    </button>
                                </div>
                            </div>

                            {/* Instructions with AI */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Instructions</label>
                                    <button
                                        type="button"
                                        onClick={() => aiAssist('suggest_instructions')}
                                        disabled={aiLoading !== null}
                                        className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:text-purple-700 disabled:opacity-50"
                                    >
                                        {aiLoading === 'suggest_instructions' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                        AI Generate
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.instructions.map((instruction, i) => (
                                        <div key={i} className="flex gap-2">
                                            <span className="w-8 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</span>
                                            <input
                                                type="text"
                                                value={instruction}
                                                onChange={e => updateField('instructions', i, e.target.value)}
                                                placeholder={`Step ${i + 1}`}
                                                className="flex-1 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition text-sm"
                                            />
                                            {formData.instructions.length > 1 && (
                                                <button type="button" onClick={() => removeField('instructions', i)} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addField('instructions')} className="text-green-600 text-sm font-bold flex items-center gap-1 hover:text-green-700">
                                        <Plus className="w-4 h-4" /> Add Step
                                    </button>
                                </div>
                            </div>

                            {/* Tags with AI */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Tags</label>
                                    <button
                                        type="button"
                                        onClick={() => aiAssist('suggest_tags')}
                                        disabled={aiLoading !== null}
                                        className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:text-purple-700 disabled:opacity-50"
                                    >
                                        {aiLoading === 'suggest_tags' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                        AI Suggest
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag, i) => (
                                        <div key={i} className="flex items-center gap-1 bg-zinc-100 rounded-lg px-3 py-1.5">
                                            <input
                                                type="text"
                                                value={tag}
                                                onChange={e => updateField('tags', i, e.target.value)}
                                                placeholder="Tag"
                                                className="w-20 bg-transparent outline-none text-sm font-medium"
                                            />
                                            {formData.tags.length > 1 && (
                                                <button type="button" onClick={() => removeField('tags', i)} className="text-zinc-400 hover:text-red-500">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addField('tags')} className="bg-green-50 text-green-600 rounded-lg px-3 py-1.5 text-sm font-bold flex items-center gap-1 hover:bg-green-100 transition">
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl shadow-green-600/25 hover:shadow-2xl hover:shadow-green-600/40 transition-all disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        <span>{initialData ? 'Update Recipe' : 'Share with Community'}</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
