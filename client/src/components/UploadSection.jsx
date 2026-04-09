import { useState, useRef } from "react";
import { Upload, FileText, X, AlertCircle, Briefcase, Sparkles } from "lucide-react";

export default function UploadSection({
    file,
    setFile,
    jobDescription,
    setJobDescription,
    onSubmit,
    loading,
}) {
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    const validateFile = (f) => {
        if (!f) return false;
        const validTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!validTypes.includes(f.type)) {
            setError("Only PDF and DOCX files are allowed");
            return false;
        }

        if (f.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB");
            return false;
        }

        setError("");
        return true;
    };

    const handleFile = (f) => {
        if (validateFile(f)) {
            setFile(f);
        }
    };

    return (
        <div className="card-base !p-5 sm:!p-8 space-y-6 sm:space-y-8">
            <div className="space-y-1 sm:space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-brand-text flex items-center gap-2">
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary" />
                    Analysis Parameters
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-brand-secondary leading-relaxed">
                    Upload your resume and paste the job description to get started.
                </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
                <label className="block text-xs sm:text-sm font-semibold text-brand-text">
                    Resume (PDF or DOCX)
                </label>
                {file ? (
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-primary/10 rounded-lg">
                                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-brand-text truncate max-w-[120px] sm:max-w-[200px]">
                                    {file.name}
                                </p>
                                <p className="text-[10px] sm:text-xs text-brand-secondary">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setFile(null)}
                            className="p-1.5 sm:p-2 hover:bg-rose-50 hover:text-rose-600 text-brand-secondary rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                ) : (
                    <div
                        className="border-2 border-dashed border-gray-200 hover:border-brand-primary/40 hover:bg-brand-primary/5 p-6 sm:p-10 rounded-2xl text-center cursor-pointer transition-all group"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            handleFile(e.dataTransfer.files[0]);
                        }}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <div className="flex flex-col items-center gap-2 sm:gap-3">
                            <div className="p-3 sm:p-4 bg-gray-50 group-hover:bg-brand-primary/10 rounded-full transition-colors">
                                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-brand-secondary group-hover:text-brand-primary" />
                            </div>
                            <div>
                                <p className="text-brand-text font-medium text-xs sm:text-base">
                                    Click to upload or drag & drop
                                </p>
                                <p className="text-[10px] sm:text-sm text-brand-secondary mt-0.5 sm:mt-1">
                                    PDF, DOCX up to 5MB
                                </p>
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            onChange={(e) => handleFile(e.target.files[0])}
                        />
                    </div>
                )}
                {error && (
                    <div className="flex items-center gap-2 text-rose-600 text-xs sm:text-sm bg-rose-50 p-2.5 sm:p-3 rounded-lg border border-rose-100">
                        <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        {error}
                    </div>
                )}
            </div>

            <div className="space-y-3 sm:space-y-4">
                <label className="block text-xs sm:text-sm font-semibold text-brand-text">
                    Job Description
                </label>
                <div className="relative">
                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the target job description here..."
                        className="w-full border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 min-h-[140px] sm:min-h-[160px] focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-brand-text leading-relaxed text-xs sm:text-base"
                    />
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-[9px] font-bold uppercase tracking-widest text-brand-secondary bg-white/80 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded border border-gray-100">
                        {jobDescription.length} chars
                    </div>
                </div>
            </div>

            <button
                onClick={onSubmit}
                disabled={!file || jobDescription.length < 50 || loading}
                className="w-full h-12 sm:h-14 bg-brand-primary hover:bg-blue-700 text-white font-bold rounded-xl sm:rounded-2xl flex justify-center items-center gap-2.5 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-all hover:-translate-y-0.5"
            >
                {loading ? (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Analyze Resume</span>
                    </>
                )}
            </button>
        </div>
    );
}