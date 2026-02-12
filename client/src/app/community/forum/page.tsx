'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { MessageSquare, ThumbsUp, Eye, Send, Plus, AlertCircle, ShieldCheck, User, Sparkles, Loader2, ArrowLeft } from 'lucide-react'
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import axios from 'axios'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

function MilletForum() {
    const { userData } = useSelector((state: RootState) => state.user)
    const [discussions, setDiscussions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAskModalOpen, setIsAskModalOpen] = useState(false)

    // New Question Form
    const [newTitle, setNewTitle] = useState('')
    const [newBody, setNewBody] = useState('')
    const [newTags, setNewTags] = useState('')

    // Expanding a discussion to see comments
    const [expandedIds, setExpandedIds] = useState<string[]>([])
    const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({})
    const [assistLoading, setAssistLoading] = useState<string | null>(null)

    const fetchDiscussions = async () => {
        try {
            const res = await axios.get('/api/community/discussions')
            setDiscussions(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDiscussions()
    }, [])

    const handleAskQuestion = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTitle || !newBody) return

        try {
            const res = await axios.post('/api/community/discussions', {
                title: newTitle,
                body: newBody,
                tags: newTags.split(',').map((t: string) => t.trim()).filter((t: string) => t)
            })
            toast.success('Question posted successfully!')
            setIsAskModalOpen(false)
            setNewTitle('')
            setNewBody('')
            setNewTags('')
            // Prepend new discussion to the top of the list immediately
            setDiscussions(prev => [res.data, ...prev])
        } catch (error) {
            toast.error('Failed to post question')
        }
    }

    const toggleLike = async (id: string) => {
        if (!userData) return toast.error('Please login to vote')
        try {
            const res = await axios.patch(`/api/community/discussions/${id}`)
            setDiscussions(prev => prev.map(d => d._id === id ? res.data : d))
        } catch (error) {
            console.error(error)
        }
    }

    const postComment = async (id: string) => {
        if (!userData) return toast.error('Please login to answer')
        const content = commentInputs[id]
        if (!content?.trim()) return

        try {
            const res = await axios.post(`/api/community/discussions/${id}`, { content })
            setDiscussions(prev => prev.map(d => d._id === id ? res.data : d))
            setCommentInputs(prev => ({ ...prev, [id]: '' }))
            toast.success('Answer added!')
        } catch (error) {
            toast.error('Failed to post answer')
        }
    }

    const toggleExpand = (id: string) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
        )
    }

    const handleAiAssist = async (id: string, question: string, description: string) => {
        if (!userData) return toast.error('Please login to use AI assist')
        setAssistLoading(id)
        if (!expandedIds.includes(id)) toggleExpand(id)
        try {
            const res = await axios.post('/api/ai/forum-assist', { question, description })
            setCommentInputs(prev => ({ ...prev, [id]: res.data.result }))
            toast.success('AI Answer drafted! Review and send.')
        } catch (error: any) {
            const msg = error.response?.data?.message || 'AI could not generate an answer';
            toast.error(msg);
        } finally {
            setAssistLoading(null)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
            <Nav user={userData || { name: "Guest", email: "", role: "user" }} />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-green-600 font-bold mb-8 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-green-50 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    <span>Back to Marketplace</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content - Feed */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Millet Forum</h1>
                                <p className="text-zinc-500 dark:text-zinc-400">Ask, discuss, and learn from the community</p>
                            </div>
                            <button
                                onClick={() => userData ? setIsAskModalOpen(true) : toast.error('Please login to ask')}
                                className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition shadow-lg shadow-green-600/20"
                            >
                                <Plus size={18} />
                                Ask Question
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-20 text-zinc-400">Loading discussions...</div>
                        ) : discussions.map((discussion) => (
                            <div key={discussion._id} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition">
                                <div className="flex items-start gap-4">
                                    <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                                        <button
                                            onClick={() => toggleLike(discussion._id)}
                                            className={`p-2 rounded-lg flex flex-col items-center gap-1 transition ${discussion.likedBy?.includes(userData?._id)
                                                ? 'text-green-600 bg-green-50 dark:bg-green-500/10'
                                                : 'text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                                                }`}
                                        >
                                            <ThumbsUp size={20} />
                                            <span className="font-bold text-sm">{discussion.likes}</span>
                                        </button>
                                    </div>

                                    <div className="flex-1">
                                        <h3
                                            onClick={() => toggleExpand(discussion._id)}
                                            className="text-xl font-bold text-zinc-900 dark:text-white mb-2 cursor-pointer hover:text-green-600 transition"
                                        >
                                            {discussion.title}
                                        </h3>
                                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-3">{discussion.body}</p>

                                        <div className="flex items-center gap-4 text-xs text-zinc-400 mb-4">
                                            <span className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                                                {discussion.userImage ? (
                                                    <Image src={discussion.userImage} width={16} height={16} className="rounded-full" alt="" />
                                                ) : <User size={12} />}
                                                {discussion.userName || 'Anonymous'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye size={14} /> {discussion.views} views
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageSquare size={14} /> {discussion.comments?.length || 0} answers
                                            </span>
                                            {discussion.tags?.map((tag: string, i: number) => (
                                                <span key={i} className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full">#{tag}</span>
                                            ))}
                                        </div>

                                        {/* Action Bar */}
                                        <div className="flex items-center gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                            <button
                                                onClick={() => toggleExpand(discussion._id)}
                                                className="text-zinc-500 dark:text-zinc-400 font-bold text-sm hover:text-green-600 dark:hover:text-green-400 transition"
                                            >
                                                {expandedIds.includes(discussion._id) ? 'Collapse' : 'View Answers'}
                                            </button>
                                            <button
                                                onClick={() => handleAiAssist(discussion._id, discussion.title, discussion.body)}
                                                className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold text-sm hover:text-purple-700 dark:hover:text-purple-300 transition"
                                                disabled={assistLoading === discussion._id}
                                            >
                                                {assistLoading === discussion._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                                Draft AI Answer
                                            </button>
                                        </div>

                                        {/* Expanded Comments Section */}
                                        {expandedIds.includes(discussion._id) && (
                                            <div className="mt-6 space-y-6">
                                                {/* Existing Comments */}
                                                {discussion.comments?.map((comment: any, idx: number) => (
                                                    <div key={idx} className="flex gap-3 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl">
                                                        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0">
                                                            {comment.userImage ? (
                                                                <Image src={comment.userImage} width={32} height={32} alt="" />
                                                            ) : <User className="w-full h-full p-1.5 text-zinc-400 dark:text-zinc-500" />}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-baseline gap-2 mb-1">
                                                                <span className="font-bold text-sm text-zinc-900 dark:text-white">{comment.userName}</span>
                                                                <span className="text-xs text-zinc-400 dark:text-zinc-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <p className="text-zinc-700 dark:text-zinc-300 text-sm whitespace-pre-wrap">{comment.content}</p>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Add Comment Input */}
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={commentInputs[discussion._id] || ''}
                                                        onChange={e => setCommentInputs(prev => ({ ...prev, [discussion._id]: e.target.value }))}
                                                        placeholder="Write a helpful answer..."
                                                        className="flex-1 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 text-zinc-900 dark:text-white"
                                                    />
                                                    <button
                                                        onClick={() => postComment(discussion._id)}
                                                        className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-2 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition"
                                                    >
                                                        <Send size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar - Rules */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 sticky top-32">
                            <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white font-black">
                                <ShieldCheck className="text-green-600 dark:text-green-400" />
                                <h2>Community Rules</h2>
                            </div>
                            <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
                                <li className="flex gap-3">
                                    <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold shrink-0">1</span>
                                    <div>
                                        <strong className="text-zinc-900 dark:text-zinc-200 block">Be Respectful</strong>
                                        No vulgarity, hate speech, or personal attacks. Treat everyone with kindness.
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold shrink-0">2</span>
                                    <div>
                                        <strong className="text-zinc-900 dark:text-zinc-200 block">No Politics</strong>
                                        Keep discussions focused on millets, health, and nutrition.
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold shrink-0">3</span>
                                    <div>
                                        <strong className="text-zinc-900 dark:text-zinc-200 block">Provide Value</strong>
                                        Ask genuine questions and provide helpful, accurate answers.
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold shrink-0">4</span>
                                    <div>
                                        <strong className="text-zinc-900 dark:text-zinc-200 block">No Spam</strong>
                                        Do not post promotional content or repeated messages.
                                    </div>
                                </li>
                            </ul>
                            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl border border-yellow-100 dark:border-yellow-500/20 text-xs text-yellow-800 dark:text-yellow-400 flex gap-2">
                                <AlertCircle size={16} className="shrink-0" />
                                <p>Violating these rules may result in account suspension. Let's keep this a safe space for everyone.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            {/* Ask Modal */}
            {isAskModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg p-8 shadow-2xl border border-zinc-100 dark:border-zinc-800"
                    >
                        <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-6">Ask the Community</h2>
                        <form onSubmit={handleAskQuestion} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Question Title</label>
                                <input
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 font-bold text-zinc-900 dark:text-white"
                                    placeholder="e.g., What is the best millet for diabetes?"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Details</label>
                                <textarea
                                    value={newBody}
                                    onChange={e => setNewBody(e.target.value)}
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 min-h-[150px] text-zinc-900 dark:text-white"
                                    placeholder="Describe your question in more detail..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Tags (comma separated)</label>
                                <input
                                    value={newTags}
                                    onChange={e => setNewTags(e.target.value)}
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 text-zinc-900 dark:text-white"
                                    placeholder="e.g., health, cooking, beginners"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAskModalOpen(false)}
                                    className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 py-3 rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-600/20"
                                >
                                    Post Question
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default MilletForum
