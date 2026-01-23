import { motion } from "framer-motion";
import {
  MapPin,
  School,
  Hospital,
  ShoppingBag,
  Train,
  Building,
} from "lucide-react";
import type { StepProps } from "./interface";

export function LocationNearby({ formData, onUpdate }: StepProps) {
  const addNearbyItem = (
    type:
      | "nearbySchools"
      | "nearbyHospitals"
      | "nearbyMalls"
      | "nearbyTransport"
      | "nearbyOffices",
    name: string,
    distance: string
  ) => {
    const currentArray =
      (formData[type] as Array<{ name: string; distance: string }>) || [];
    const newItem = { name, distance };
    const updatedArray = [...currentArray, newItem];
    onUpdate(type, updatedArray);
  };

  const removeNearbyItem = (
    type:
      | "nearbySchools"
      | "nearbyHospitals"
      | "nearbyMalls"
      | "nearbyTransport"
      | "nearbyOffices",
    index: number
  ) => {
    const currentArray =
      (formData[type] as Array<{ name: string; distance: string }>) || [];
    const updatedArray = currentArray.filter(
      (_: any, i: number) => i !== index
    );
    onUpdate(type, updatedArray);
  };

  const nearbySections = [
    { key: "nearbySchools" as const, label: "Schools", icon: School },
    { key: "nearbyHospitals" as const, label: "Hospitals", icon: Hospital },
    { key: "nearbyMalls" as const, label: "Shopping Malls", icon: ShoppingBag },
    { key: "nearbyTransport" as const, label: "Public Transport", icon: Train },
    { key: "nearbyOffices" as const, label: "Offices", icon: Building },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <MapPin className="text-vista-accent h-5 w-5" />
        <h3 className="text-vista-primary text-lg font-semibold">
          Location & Nearby Places
        </h3>
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-vista-text mb-2 block text-sm font-medium">
            Latitude
          </label>
          <input
            type="text"
            value={formData.latitude}
            onChange={(e) => onUpdate("latitude", e.target.value)}
            placeholder="14.5995"
            className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border px-4 py-2.5 transition-all outline-none focus:ring-2"
          />
        </div>

        <div>
          <label className="text-vista-text mb-2 block text-sm font-medium">
            Longitude
          </label>
          <input
            type="text"
            value={formData.longitude}
            onChange={(e) => onUpdate("longitude", e.target.value)}
            placeholder="120.9842"
            className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 w-full rounded-xl border px-4 py-2.5 transition-all outline-none focus:ring-2"
          />
        </div>
      </div>

      {/* Nearby Places */}
      <div className="space-y-4">
        <h4 className="text-vista-primary font-medium">
          Nearby Establishments
        </h4>
        <p className="text-vista-text/70 text-sm">
          Add nearby schools, hospitals, malls, and other important
          establishments with their distances.
        </p>

        {nearbySections.map(({ key, label, icon: Icon }) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon className="text-vista-accent h-4 w-4" />
              <span className="text-vista-text text-sm font-medium">
                {label}
              </span>
            </div>

            {/* Existing items */}
            {formData[key]?.map(
              (item: { name: string; distance: string }, index: number) => (
                <div
                  key={index}
                  className="bg-vista-surface/20 flex items-center justify-between rounded-lg p-3"
                >
                  <div>
                    <span className="text-vista-text font-medium">
                      {item.name}
                    </span>
                    <span className="text-vista-text/60 ml-2 text-sm">
                      ({item.distance})
                    </span>
                  </div>
                  <button
                    onClick={() => removeNearbyItem(key, index)}
                    className="text-vista-text/50 text-sm hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              )
            )}

            {/* Add new item form */}
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Name"
                className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 rounded-lg border px-3 py-2 text-sm transition-all outline-none focus:ring-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const name = e.currentTarget.value.trim();
                    const distanceInput = e.currentTarget
                      .nextElementSibling as HTMLInputElement;
                    const distance = distanceInput?.value.trim();
                    if (name && distance) {
                      addNearbyItem(key, name, distance);
                      e.currentTarget.value = "";
                      distanceInput.value = "";
                    }
                  }
                }}
              />
              <input
                type="text"
                placeholder="Distance (e.g., 2km)"
                className="border-vista-surface/30 focus:border-vista-accent focus:ring-vista-accent/20 rounded-lg border px-3 py-2 text-sm transition-all outline-none focus:ring-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const distance = e.currentTarget.value.trim();
                    const nameInput = e.currentTarget
                      .previousElementSibling as HTMLInputElement;
                    const name = nameInput?.value.trim();
                    if (name && distance) {
                      addNearbyItem(key, name, distance);
                      nameInput.value = "";
                      e.currentTarget.value = "";
                    }
                  }
                }}
              />
              <button
                className="bg-vista-accent hover:bg-vista-accent/90 rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors"
                onClick={(e) => {
                  const container = e.currentTarget.parentElement;
                  const nameInput = container?.children[0] as HTMLInputElement;
                  const distanceInput = container
                    ?.children[1] as HTMLInputElement;
                  const name = nameInput?.value.trim();
                  const distance = distanceInput?.value.trim();
                  if (name && distance) {
                    addNearbyItem(key, name, distance);
                    nameInput.value = "";
                    distanceInput.value = "";
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
