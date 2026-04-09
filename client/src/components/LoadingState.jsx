import { motion } from "framer-motion";

export default function LoadingState() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 sm:space-y-10 pb-20"
        >
            {/* Top Section: Score & Summary Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="lg:col-span-1 card-base flex flex-col items-center justify-center py-12">
                    <div className="skeleton w-32 h-32 sm:w-48 sm:h-48 rounded-full mb-6 sm:mb-8" />
                    <div className="skeleton w-24 h-6 mb-2" />
                    <div className="skeleton w-40 h-4" />
                </div>
                <div className="lg:col-span-2 card-base flex flex-col justify-center !p-5 sm:!p-10">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="skeleton w-6 h-6 rounded-lg" />
                        <div className="skeleton w-48 h-6" />
                    </div>
                    <div className="space-y-4">
                        <div className="skeleton w-full h-5 rounded-lg" />
                        <div className="skeleton w-full h-5 rounded-lg" />
                        <div className="skeleton w-[90%] h-5 rounded-lg" />
                        <div className="skeleton w-[60%] h-5 rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Keyword Analysis Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                    <div key={i} className="card-base !p-5 sm:!p-8">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="skeleton w-5 h-5 rounded-full" />
                            <div className="skeleton w-32 h-5" />
                        </div>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {[1, 2, 3, 4, 5, 6].map((j) => (
                                <div key={j} className="skeleton w-20 h-8 sm:h-10 rounded-xl" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* ATS Optimization Skeleton */}
            <div className="card-base !p-5 sm:!p-8">
                <div className="flex items-center gap-2 mb-8">
                    <div className="skeleton w-5 h-5 rounded-lg" />
                    <div className="skeleton w-40 h-6" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="skeleton w-full h-16 rounded-2xl" />
                    ))}
                </div>
            </div>

            {/* Structural Check Skeleton */}
            <div className="card-base !p-5 sm:!p-8">
                <div className="flex items-center gap-2 mb-8">
                    <div className="skeleton w-5 h-5 rounded-lg" />
                    <div className="skeleton w-40 h-6" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="skeleton w-full h-12 rounded-xl" />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
