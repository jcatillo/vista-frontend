import { motion } from "framer-motion";
import { Layers, Wand2, ArrowLeft, Upload, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SellerFooter } from "../../components/sections/seller";

export default function SellerStaging() {
  const navigate = useNavigate();

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/seller/dashboard")}
            className="text-vista-text/60 hover:text-vista-primary mb-4 flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-vista-accent flex h-12 w-12 items-center justify-center rounded-xl">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-vista-primary text-2xl font-bold md:text-4xl">
                AI Virtual Staging
              </h1>
              <p className="text-vista-text/70 text-sm md:text-base">
                Transform empty rooms with AI-generated furniture and decor
              </p>
            </div>
          </div>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="shadow-soft rounded-2xl border-2 border-dashed border-gray-200 bg-white p-8 text-center transition-colors hover:border-gray-300 md:p-12">
            <div className="bg-vista-surface mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
              <Upload className="text-vista-accent h-10 w-10" />
            </div>
            <h3 className="text-vista-primary mb-2 text-lg font-bold">
              Upload Room Image
            </h3>
            <p className="text-vista-text/60 mx-auto mb-6 max-w-md text-sm">
              Drag and drop your empty room photo here, or click to browse. We
              support JPG, PNG, and HEIC formats.
            </p>
            <button className="bg-vista-primary hover:bg-vista-primary/90 rounded-full px-6 py-3 font-medium text-white transition-colors">
              Choose Image
            </button>
          </div>
        </motion.div>

        {/* Style Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-vista-primary mb-4 text-lg font-bold">
            Choose a Style
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {["Modern", "Minimalist", "Scandinavian", "Industrial"].map(
              (style, idx) => (
                <StyleCard key={style} style={style} delay={idx * 0.05} />
              )
            )}
          </div>
        </motion.div>

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <button className="bg-vista-accent hover:bg-vista-accent/90 inline-flex items-center gap-2 rounded-full px-8 py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl">
            <Wand2 className="h-5 w-5" />
            Generate Staged Image
            <Sparkles className="h-4 w-4" />
          </button>
          <p className="text-vista-text/50 mt-3 text-xs">
            Powered by AI • Results in ~30 seconds
          </p>
        </motion.div>
      </section>
      <SellerFooter />
    </>
  );
}

function StyleCard({ style, delay }: { style: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
    >
      <div className="shadow-soft overflow-hidden rounded-xl border border-white/50 bg-white transition-shadow hover:shadow-lg">
        <div className="bg-vista-surface aspect-video" />
        <div className="p-3 text-center">
          <span className="text-vista-primary text-sm font-medium">{style}</span>
        </div>
      </div>
    </motion.div>
  );
}
