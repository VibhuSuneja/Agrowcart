import { Metadata } from 'next';
import { auth } from '@/auth';
import Nav from '@/components/Nav';
import ProductItemCard from '@/components/ProductItemCard';
import connectDb from '@/lib/db';
import Product, { IProduct } from '@/models/product.model';
import User from '@/models/user.model';
import { redirect } from 'next/navigation';
import { Sparkles, ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
    const { category } = await params;
    const decoded = decodeURIComponent(category);
    return {
        title: `${decoded} Products`,
        description: `Browse premium ${decoded.toLowerCase()} products on AgrowCart. Fresh, organic millets sourced directly from verified farmers across India.`,
        openGraph: {
            title: `${decoded} Products | AgrowCart`,
            description: `Explore ${decoded.toLowerCase()} millets on AgrowCart marketplace.`,
        },
    }
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ category: string }>;
}) {
    const { category } = await params;
    const decodedCategory = decodeURIComponent(category);

    await connectDb();
    const session = await auth();
    if (!session) redirect('/login');

    const user = await User.findById(session?.user?.id);
    if (!user) redirect('/login');

    const inComplete = !user.role || (user.role === 'user' && !user.mobile);
    if (inComplete) {
        redirect('/');
    }

    const plainUser = JSON.parse(JSON.stringify(user));

    // Fetch products for this category
    const products = await Product.find({ category: decodedCategory }).lean();
    const plainProducts = JSON.parse(JSON.stringify(products));

    return (
        <>
            <Nav user={plainUser} />

            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-24 pb-20">
                <div className="w-[95%] md:w-[85%] mx-auto">
                    {/* Back Button */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-8 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-semibold">Back to Home</span>
                    </Link>

                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-2 text-green-600 font-bold uppercase tracking-[0.2em] text-xs mb-3">
                            <Sparkles size={16} />
                            <span>Category</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">
                            {decodedCategory}
                        </h1>
                        <p className="text-zinc-500 text-lg">
                            Discover {plainProducts.length} premium {decodedCategory.toLowerCase()} products
                        </p>
                    </div>

                    {/* Products Grid */}
                    {plainProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                            {plainProducts.map((product: any, index: number) => (
                                <ProductItemCard key={index} item={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-200">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <Package className="text-zinc-300" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-2">
                                No products found
                            </h3>
                            <p className="text-zinc-500 mb-6">
                                We don't have any {decodedCategory.toLowerCase()} products yet.
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                            >
                                <ArrowLeft size={18} />
                                Browse All Products
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}
