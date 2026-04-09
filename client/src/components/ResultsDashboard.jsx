import ScoreCard from "./ScoreCard";
import KeywordChips from "./KeywordChips";
import BulletSuggestions from "./BulletSuggestions";
import { Search, TextQuote, AlertTriangle, ListChecks } from "lucide-react";
import { motion } from "framer-motion";

export default function ResultsDashboard({ results }) {
    if (!results) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 sm:space-y-10 pb-16 sm:pb-20"
        >
            {/* Top Section: Score & Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="lg:col-span-1">
                    <ScoreCard
                        score={results.match_score}
                        label={results.score_label}
                    />
                </div>
                <div className="lg:col-span-2 card-base flex flex-col justify-center !p-5 sm:!p-8">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <TextQuote className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                        <h3 className="text-lg sm:text-xl font-bold text-brand-text">AI Analysis Summary</h3>
                    </div>
                    <p className="text-brand-text leading-relaxed text-sm sm:text-base md:text-lg italic">
                        "{results.summary}"
                    </p>
                </div>
            </div>

            {/* Keyword Analysis */}
            <KeywordChips
                missingKeywords={results.missing_keywords}
                strongKeywords={results.strong_keywords}
            />

            {/* ATS Issues */}
            <div className="card-base !p-5 sm:!p-8">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg sm:text-xl font-bold text-brand-text">ATS Optimization</h3>
                </div>
                {results.ats_issues.length === 0 ? (
                    <div className="flex items-center gap-2.5 p-3.5 sm:p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                        <ListChecks className="w-5 h-5" />
                        <p className="font-semibold text-sm sm:text-base">Your resume is perfectly formatted for ATS systems!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {results.ats_issues.map((issue, i) => (
                            <div key={i} className="flex items-start gap-3 p-3.5 sm:p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                <p className="text-xs sm:text-sm text-brand-text leading-relaxed">{issue}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bullet Point Suggestions */}
            <BulletSuggestions weakBullets={results.weak_bullets} />

            {/* Sections Detected */}
            <div className="card-base !p-5 sm:!p-8">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <Search className="w-5 h-5 text-brand-primary" />
                    <h3 className="text-lg sm:text-xl font-bold text-brand-text">Resume Structure</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {Object.entries(results.sections_detected).map(
                        ([key, val]) => (
                            <div
                                key={key}
                                className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all ${val
                                    ? "bg-emerald-50/50 border-emerald-100 text-emerald-700"
                                    : "bg-rose-50/50 border-rose-100 text-rose-700 opacity-60"
                                    }`}
                            >
                                <span className="text-[11px] sm:text-sm font-bold capitalize">{key}</span>
                                <span className="text-xs">{val ? "✓" : "✗"}</span>
                            </div>
                        )
                    )}
                </div>
            </div>
        </motion.div>
    );
}