import { CheckCircle2, XCircle } from "lucide-react";

export default function KeywordChips({
    missingKeywords,
    strongKeywords,
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strong */}
            <div className="card-base !p-5 sm:!p-6">
                <div className="flex items-center gap-2 mb-4 sm:mb-5">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                    <h3 className="text-lg font-bold text-brand-text leading-tight">
                        Strong Keywords
                    </h3>
                </div>
                {strongKeywords.length === 0 ? (
                    <p className="text-xs sm:text-sm text-brand-secondary">None found in your resume.</p>
                ) : (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {strongKeywords.map((k, i) => (
                            <span
                                key={i}
                                className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold border border-emerald-100/50"
                            >
                                {k}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Missing */}
            <div className="card-base !p-5 sm:!p-6">
                <div className="flex items-center gap-2 mb-4 sm:mb-5">
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
                    <h3 className="text-lg font-bold text-brand-text leading-tight">
                        Missing Keywords
                    </h3>
                </div>
                {missingKeywords.length === 0 ? (
                    <p className="text-xs sm:text-sm text-brand-secondary">Everything looks good!</p>
                ) : (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {missingKeywords.map((k, i) => (
                            <span
                                key={i}
                                className="bg-rose-50 text-rose-700 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold border border-rose-100/50"
                            >
                                {k}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}