import { useState } from "react";
import API from "./services/api";
import UploadSection from "./components/UploadSection";
import ResultsDashboard from "./components/ResultsDashboard";
import LoadingState from "./components/LoadingState";
import { Sparkles, Layout, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log(API.defaults.baseURL)

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setResults(null);

      // Scroll to top or to results area
      window.scrollTo({ top: 300, behavior: 'smooth' });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobDescription", jobDescription);

      const res = await API.post("/analyze", formData);
      if (res.data.is_resume === false) {
        setError(`⚠️ ${res.data.error_message} Please upload a valid resume.`);
        setResults(null);
        return;
      }
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background selection:bg-brand-primary/10">
      {/* Redesigned Floating Navbar */}
      <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-max">
        <nav className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-soft rounded-full px-3 sm:px-5 h-11 sm:h-12 flex items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="p-1 bg-brand-primary rounded-lg text-white">
              <Layout className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-sm sm:text-base font-bold tracking-tight text-brand-text">
              Resume <span className="text-brand-primary">AI</span>
            </span>
          </div>

          <div className="h-4 w-px bg-gray-200 hidden sm:block" />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-brand-primary"
          >
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>GPT-4 AI</span>
          </motion.div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16 sm:py-24 md:py-32">
        {/* Hero Section */}
        <section className="text-center mt-10 sm:mt-2 mb-10 sm:mb-16 px-4">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-brand-text tracking-tight mb-4 sm:mb-6 leading-tight">
            Land your dream job <br />
            <span className="text-brand-primary">with AI precision</span>
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-brand-secondary max-w-2xl mx-auto leading-relaxed">
            Instant ATS optimization, keyword matching, and bullet point rewriting.
            Built for modern professionals.
          </p>
        </section>

        {/* Action Section */}
        <div className="space-y-12">
          <UploadSection
            file={file}
            setFile={setFile}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            onSubmit={handleSubmit}
            loading={loading}
          />

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-rose-50 text-rose-700 p-4 rounded-2xl border border-rose-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 font-medium">
                  <CheckCircle2 className="w-5 h-5 opacity-0" /> {/* Spacer */}
                  {error}
                </div>
                <button
                  onClick={() => setError("")}
                  className="hover:bg-rose-100 p-1.5 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {loading && (
              <LoadingState />
            )}

            {!loading && results && (
              <ResultsDashboard results={results} />
            )}

            {!loading && !results && !error && (
              <div className="flex flex-col items-center justify-center py-20 opacity-30 select-none">
                <Layout className="w-20 h-20 mb-4 text-brand-secondary" />
                <p className="text-lg font-medium text-brand-secondary">
                  Results will appear here
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-sm text-brand-secondary">
          &copy; {new Date().getFullYear()} Resume AI Analyzer. All rights reserved.
        </p>
      </footer>
    </div>
  );
}