import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BulletSuggestions({ weakBullets }) {
    const [openIndex, setOpenIndex] = useState(null);

    if (!weakBullets || weakBullets.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 px-1">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                <h3 className="text-lg sm:text-xl font-bold text-brand-text">
                    Resume Improvements
                </h3>
            </div>

            <div className="space-y-4">
                {weakBullets.map((b, i) => (
                    <div
                        key={i}
                        className="card-base overflow-hidden !p-0"
                    >
                        <div className="p-4 sm:p-5">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="mt-1">
                                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-brand-secondary text-[10px] sm:text-sm font-bold mb-0.5 sm:mb-1 uppercase tracking-wider">
                                        Original
                                    </p>
                                    <p className="text-brand-text leading-relaxed text-sm sm:text-base">
                                        {b.original}
                                    </p>
                                </div>
                            </div>

                            <div className="my-4 sm:my-6 flex items-center gap-3 sm:gap-4">
                                <div className="h-px flex-1 bg-gray-100" />
                                <div className="p-1.5 sm:p-2 bg-brand-primary/5 rounded-full">
                                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-primary" />
                                </div>
                                <div className="h-px flex-1 bg-gray-100" />
                            </div>

                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="mt-1">
                                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-brand-secondary text-[10px] sm:text-sm font-bold mb-0.5 sm:mb-1 uppercase tracking-wider">
                                        Suggested Improvement
                                    </p>
                                    <p className="text-emerald-700 leading-relaxed font-bold text-sm sm:text-base">
                                        {b.rewritten}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50/50 px-4 sm:px-5 py-3 border-t border-gray-100">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="flex items-center gap-2 text-xs sm:text-sm text-brand-secondary hover:text-brand-primary transition-colors font-medium"
                            >
                                {openIndex === i ? <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                <span>Why this improvement?</span>
                            </button>

                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="pt-3 text-xs sm:text-sm text-brand-secondary leading-relaxed bg-brand-primary/5 p-3 sm:p-4 rounded-xl mt-2 border border-brand-primary/10">
                                            {b.reason}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}