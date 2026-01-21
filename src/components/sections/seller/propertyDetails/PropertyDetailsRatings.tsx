import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Property } from "../../../../data/properties";

interface PropertyDetailsRatingsProps {
  property: Property;
}

export function PropertyDetailsRatings({
  property,
}: PropertyDetailsRatingsProps) {
  const { ratings } = property;

  const ratingCategories = [
    { label: "Build Quality", value: ratings.breakdown.cleanliness },
    { label: "Property Value", value: ratings.breakdown.accuracy },
    { label: "Location Appeal", value: ratings.breakdown.communication },
    { label: "Neighborhood", value: ratings.breakdown.location },
    { label: "Investment Potential", value: ratings.breakdown.value },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="bg-white shadow-soft rounded-2xl border border-white/50 p-6 md:p-8"
    >
      <h2 className="text-vista-primary text-xl font-bold mb-6">Property Ratings</h2>

      {/* Overall Rating */}
      <div className="mb-8 pb-8 border-b border-vista-surface">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-vista-primary text-4xl font-bold">
                {ratings.overallRating}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(ratings.overallRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-vista-text/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="text-vista-text/70 text-sm">
              <span className="font-semibold text-vista-primary">
                {ratings.totalReviews}
              </span>{" "}
              buyer reviews and valuations
            </p>
            <p className="text-vista-text/60 text-xs mt-1">
              Based on market analysis and buyer satisfaction
            </p>
          </div>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="space-y-4">
        {ratingCategories.map((category, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-vista-text/70 text-sm">
                {category.label}
              </span>
              <span className="text-vista-primary font-semibold text-sm">
                {category.value}
              </span>
            </div>
            <div className="w-full bg-vista-surface/30 rounded-full h-2">
              <div
                className="bg-vista-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${(category.value / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Star Distribution */}
      <div className="mt-8 pt-8 border-t border-vista-surface">
        <p className="text-vista-primary font-semibold mb-3">Valuation Distribution</p>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-2">
              <span className="text-vista-text/60 text-xs w-12">
                {stars} star
              </span>
              <div className="flex-1 bg-vista-surface/30 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{
                    width: `${
                      stars === 5
                        ? 65
                        : stars === 4
                          ? 25
                          : stars === 3
                            ? 7
                            : stars === 2
                              ? 2
                              : 1
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
