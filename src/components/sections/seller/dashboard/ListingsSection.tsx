import { motion } from "framer-motion";
import {
  BarChart3,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface PropertyListing {
  id: string;
  name: string;
  address: string;
  status: "active" | "pending" | "draft";
  views: number;
  image: string;
  price: string;
}

const mockProperties: PropertyListing[] = [
  {
    id: "1",
    name: "Modern Loft Apartment",
    address: "123 Vista Avenue, Cebu City",
    status: "active",
    views: 245,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=400",
    price: "₱4,500,000",
  },
  {
    id: "2",
    name: "Seaside Villa",
    address: "456 Coastal Road, Lapu-Lapu",
    status: "pending",
    views: 128,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400",
    price: "₱12,800,000",
  },
  {
    id: "3",
    name: "Urban Studio",
    address: "789 Business Park, Mandaue",
    status: "draft",
    views: 0,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400",
    price: "₱2,200,000",
  },
];

export function ListingsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex items-center justify-between md:mb-8"
      >
        <div>
          <h2 className="text-vista-primary text-xl font-bold md:text-2xl">
            Your Listings
          </h2>
          <p className="text-vista-text/60 text-sm">
            Manage and monitor your property portfolio
          </p>
        </div>
        <button className="text-vista-accent hover:text-vista-primary flex items-center gap-1 text-sm font-medium transition-colors">
          View All
          <BarChart3 className="h-4 w-4" />
        </button>
      </motion.div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {mockProperties.map((property, idx) => (
          <PropertyCard
            key={property.id}
            property={property}
            delay={idx * 0.1}
          />
        ))}
      </div>
    </section>
  );
}

interface PropertyCardProps {
  property: PropertyListing;
  delay: number;
}

function PropertyCard({ property, delay }: PropertyCardProps) {
  const statusConfig = {
    active: {
      icon: CheckCircle2,
      color: "text-green-600 bg-green-50",
      label: "Active",
    },
    pending: {
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
      label: "Pending Review",
    },
    draft: {
      icon: AlertCircle,
      color: "text-gray-500 bg-gray-100",
      label: "Draft",
    },
  };

  const status = statusConfig[property.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group cursor-pointer"
    >
      <div className="shadow-soft h-full overflow-hidden rounded-2xl border border-white/50 bg-white transition-shadow duration-300 hover:shadow-xl">
        {/* Image */}
        <div className="relative aspect-4/3 overflow-hidden">
          <img
            src={property.image}
            alt={property.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="from-vista-primary/60 absolute inset-0 bg-linear-to-t to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Status Badge */}
          <div
            className={`absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {status.label}
          </div>

          {/* Price Badge */}
          <div className="bg-vista-primary/90 absolute bottom-3 left-3 rounded-lg px-3 py-1.5 backdrop-blur-sm">
            <span className="text-sm font-bold text-white">
              {property.price}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-5">
          <h4 className="text-vista-primary mb-1 truncate text-base font-bold md:text-lg">
            {property.name}
          </h4>
          <p className="text-vista-text/60 mb-3 truncate text-xs md:text-sm">
            {property.address}
          </p>

          <div className="flex items-center justify-between">
            <div className="text-vista-text/60 flex items-center gap-1.5 text-xs">
              <Eye className="h-3.5 w-3.5" />
              <span>{property.views} views</span>
            </div>
            <button className="text-vista-accent hover:text-vista-primary text-xs font-medium transition-colors">
              Manage →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
