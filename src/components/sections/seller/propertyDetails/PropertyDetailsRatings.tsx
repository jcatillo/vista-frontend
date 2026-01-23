import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Property } from "../../../../types/property";

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
      className="shadow-soft rounded-2xl border border-white/50 bg-white p-6 md:p-8"
    >
      <h2 className="text-vista-primary mb-6 text-xl font-bold">
        Property Ratings
      </h2>

      {/* Overall Rating */}
      <div className="border-vista-surface mb-8 border-b pb-8">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-vista-primary text-4xl font-bold">
                {ratings.overallRating}
              </p>
              <div className="mt-1 flex items-center gap-1">
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
              <span className="text-vista-primary font-semibold">
                {ratings.totalReviews}
              </span>{" "}
              buyer reviews and valuations
            </p>
            <p className="text-vista-text/60 mt-1 text-xs">
              Based on market analysis and buyer satisfaction
            </p>
          </div>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="space-y-4">
        {ratingCategories.map((category, idx) => (
          <div key={idx}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-vista-text/70 text-sm">
                {category.label}
              </span>
              <span className="text-vista-primary text-sm font-semibold">
                {category.value}
              </span>
            </div>
            <div className="bg-vista-surface/30 h-2 w-full rounded-full">
              <div
                className="bg-vista-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${(category.value / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Star Distribution */}
      <div className="border-vista-surface mt-8 border-t pt-8">
        <p className="text-vista-primary mb-3 font-semibold">
          Valuation Distribution
        </p>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-2">
              <span className="text-vista-text/60 w-12 text-xs">
                {stars} star
              </span>
              <div className="bg-vista-surface/30 h-2 flex-1 rounded-full">
                <div
                  className="h-2 rounded-full bg-yellow-400"
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
