import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ScoreCard({ score, label }) {
    const [offset, setOffset] = useState(339.29);
    const circumference = 339.29;
    const finalOffset = circumference - (score / 100) * circumference;

    const getColor = () => {
        if (score < 41) return "#EF4444"; // Red
        if (score < 71) return "#F59E0B"; // Amber
        return "#10B981"; // Emerald
    };

    useEffect(() => {
        const timer = setTimeout(() => setOffset(finalOffset), 500);
        return () => clearTimeout(timer);
    }, [finalOffset]);

    return (
        <div className="card-base flex flex-col items-center justify-center py-8 sm:py-10">
            <div className="relative flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-32 h-32 sm:w-48 sm:h-48 transform -rotate-90">
                    <circle
                        cx="60"
                        cy="60"
                        r="54"
                        stroke="#F3F4F6"
                        strokeWidth="8"
                        fill="none"
                    />
                    <motion.circle
                        cx="60"
                        cy="60"
                        r="54"
                        stroke={getColor()}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl sm:text-5xl font-bold tracking-tight text-brand-text">
                        {score}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-secondary mt-0.5 sm:mt-1">
                        / 100
                    </span>
                </div>
            </div>

            <div className="mt-4 sm:mt-6 text-center">
                <h3 className="text-lg sm:text-xl font-bold text-brand-text mb-0.5 sm:mb-1">
                    {label}
                </h3>
                <p className="text-xs sm:text-sm text-brand-secondary max-w-[180px] leading-relaxed">
                    Overall resume quality based on job requirements.
                </p>
            </div>
        </div>
    );
}