"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Home, Mail, User, LogOut, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SellerNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/seller/dashboard" },
    { label: "Properties", icon: Home, href: "/seller/properties" },
    { label: "Messages", icon: Mail, href: "/seller/messages" },
  ];

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate("/get-started");
    setIsProfileOpen(false);
  };

  const handleProfileSettings = () => {
    // TODO: Navigate to profile settings
    setIsProfileOpen(false);
  };

  return (
    <>
      {/* Reserved Space for Navbar */}
      <div className="h-16 md:h-20" />
      
      {/* Navbar Container */}
      <nav
        className={`z-50 w-full flex justify-center ${
          isScrolled ? "fixed left-1/2 top-6 -translate-x-1/2 md:top-8" : "absolute left-1/2 -translate-x-1/2 -translate-y-full"
        }`}
      >
        {/* Floating Glass Nav */}
        <div
          className={`w-fit whitespace-nowrap border-white/10 rounded-3xl border px-2 py-2 backdrop-blur-xl md:px-3 md:py-3 ${
            isScrolled
              ? "bg-white/10 shadow-glass"
              : "bg-white/5 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-1 md:gap-2">
          {/* Nav Items */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <div key={item.label} className="relative">
                  <button
                    onClick={() => navigate(item.href)}
                    className={`flex items-center gap-2 rounded-2xl px-3 py-2 transition-all duration-200 md:px-4 md:py-2.5 ${
                      isActive
                        ? "text-vista-primary bg-white/20"
                        : "text-vista-text/70 hover:text-vista-primary hover:bg-white/20"
                    }`}
                    title={item.label}
                  >
                    <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="hidden text-xs font-medium md:inline">
                      {item.label}
                    </span>
                  </button>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-vista-accent rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="mx-1 h-6 w-px bg-white/20" />

          {/* Profile Button */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="text-vista-text/70 hover:text-vista-primary hover:bg-white/20 flex items-center justify-center rounded-2xl p-2 transition-all duration-200 md:p-2.5"
              title="Profile"
            >
              <User className="h-4 w-4 md:h-5 md:w-5" />
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="border-white/10 bg-white/10 shadow-glass absolute right-0 top-full mt-2 w-48 rounded-2xl border backdrop-blur-xl"
                >
                  <div className="p-2">
                    {/* Profile Settings */}
                    <button
                      onClick={handleProfileSettings}
                      className="text-vista-text/80 hover:text-vista-primary hover:bg-white/20 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="text-sm font-medium">Profile Settings</span>
                    </button>

                    {/* Divider */}
                    <div className="my-1 h-px bg-white/20" />

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="text-vista-text/80 hover:text-red-500 hover:bg-red-500/10 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Click outside to close */}
            {isProfileOpen && (
              <div
                className="fixed inset-0"
                onClick={() => setIsProfileOpen(false)}
              />
            )}
          </div>
          </div>
        </div>
      </nav>
    </>
  );
}
