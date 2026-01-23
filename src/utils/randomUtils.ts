// utils/randomUtils.ts

/**
 * Seeded random function for consistent values across components
 * @param seed - String seed for deterministic random generation
 * @returns Number between 0 and 1
 */
export function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

/**
 * Generate consistent random property stats for a given property ID
 * @param propertyId - The property ID to generate stats for
 * @returns Object with views, inquiries, and listingDate
 */
export function generatePropertyStats(propertyId: string) {
  const seed = propertyId;

  const views = Math.floor(seededRandom(seed + "views") * 2000) + 100;
  const inquiries = Math.floor(seededRandom(seed + "inquiries") * 50) + 1;

  // Generate consistent random date within last year
  const daysAgo = Math.floor(seededRandom(seed + "date") * 365);
  const listingDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const data = {
    views,
    inquiries,
    listingDate,
  };

  console.log(`GENERATED PROPERTY FOR ID ${propertyId}:`, data);
  return {
    views,
    inquiries,
    listingDate,
  };
}
