import { motion } from "framer-motion";
import { Calendar, TrendingUp } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Chart data
const viewsData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Views",
      data: [120, 180, 150, 280, 320, 250, 190],
      backgroundColor: "#2fbfa1",
      hoverBackgroundColor: "#244551",
      borderRadius: 8,
      borderSkipped: false,
    },
  ],
};

const listingStatusData = {
  labels: ["Active", "Pending", "Draft"],
  datasets: [
    {
      data: [7, 3, 2],
      backgroundColor: ["#2fbfa1", "#f59e0b", "#9ca3af"],
      borderWidth: 0,
      cutout: "70%",
    },
  ],
};

const inquiriesData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Inquiries",
      data: [18, 24, 32, 28, 42, 34],
      borderColor: "#2fbfa1",
      backgroundColor: "rgba(47, 191, 161, 0.1)",
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "#2fbfa1",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    },
  ],
};

export function AnalyticsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8"
      >
        <h2 className="text-vista-primary text-xl font-bold md:text-2xl">
          Analytics Overview
        </h2>
        <p className="text-vista-text/60 text-sm">
          Track your property performance and engagement
        </p>
      </motion.div>

      {/* Charts Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6 grid grid-cols-1 gap-4 md:mb-8 md:grid-cols-3 md:gap-6"
      >
        {/* Weekly Views Bar Chart */}
        <div className="shadow-soft col-span-1 rounded-2xl border border-white/50 bg-white p-5 md:col-span-2 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-vista-primary text-base font-bold md:text-lg">
                Weekly Property Views
              </h3>
              <p className="text-vista-text/60 text-xs md:text-sm">
                Last 7 days performance
              </p>
            </div>
            <div className="bg-vista-surface flex items-center gap-2 rounded-lg px-3 py-1.5">
              <Calendar className="text-vista-accent h-4 w-4" />
              <span className="text-vista-text text-xs font-medium">
                This Week
              </span>
            </div>
          </div>
          <div className="h-48 md:h-56">
            <Bar
              data={viewsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: "#244551",
                    titleFont: { family: "Poppins", size: 12 },
                    bodyFont: { family: "Poppins", size: 11 },
                    padding: 10,
                    cornerRadius: 8,
                  },
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: {
                      color: "#152b32",
                      font: { family: "Poppins", size: 11 },
                    },
                  },
                  y: {
                    grid: { color: "rgba(0,0,0,0.05)" },
                    ticks: {
                      color: "#152b32",
                      font: { family: "Poppins", size: 11 },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Listing Status Donut Chart */}
        <div className="shadow-soft rounded-2xl border border-white/50 bg-white p-5 md:p-6">
          <div className="mb-4">
            <h3 className="text-vista-primary text-base font-bold md:text-lg">
              Property Status
            </h3>
            <p className="text-vista-text/60 text-xs md:text-sm">
              Distribution overview
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-32 w-32 md:h-40 md:w-40">
              <Doughnut
                data={listingStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: "#244551",
                      titleFont: { family: "Poppins", size: 12 },
                      bodyFont: { family: "Poppins", size: 11 },
                      padding: 10,
                      cornerRadius: 8,
                    },
                  },
                }}
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-vista-primary text-2xl font-bold md:text-3xl">
                  12
                </span>
                <span className="text-vista-text/60 text-xs">Total</span>
              </div>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { status: "Active", count: 7, color: "#2fbfa1" },
                { status: "Pending", count: 3, color: "#f59e0b" },
                { status: "Draft", count: 2, color: "#9ca3af" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-vista-text/80 text-xs font-medium">
                    {item.status} ({item.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Inquiries Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="shadow-soft rounded-2xl border border-white/50 bg-white p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-vista-primary text-base font-bold md:text-lg">
                Inquiries Trend
              </h3>
              <p className="text-vista-text/60 text-xs md:text-sm">
                Monthly inquiry performance
              </p>
            </div>
            <div className="text-vista-accent flex items-center gap-1 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              +42% growth
            </div>
          </div>
          <div className="h-48 md:h-56">
            <Line
              data={inquiriesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: "#244551",
                    titleFont: { family: "Poppins", size: 12 },
                    bodyFont: { family: "Poppins", size: 11 },
                    padding: 10,
                    cornerRadius: 8,
                  },
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: {
                      color: "#152b32",
                      font: { family: "Poppins", size: 11 },
                    },
                  },
                  y: {
                    grid: { color: "rgba(0,0,0,0.05)" },
                    ticks: {
                      color: "#152b32",
                      font: { family: "Poppins", size: 11 },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
