interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "#hero", label: "Home" },
  { href: "#staging", label: "AI Staging" },
  { href: "#echo", label: "Voice Design" },
  { href: "#mark", label: "AI Assistant" },
  { href: "#cost", label: "Cost Estimates" },
];

export function Navbar() {
  return (
    <nav className="bg-vista-bg/80 fixed top-0 right-(--scrollbar-width,17px) left-0 z-50 border-b border-white/20 backdrop-blur-sm">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8 md:py-6">
        <div className="font-display text-vista-primary text-xl font-bold md:text-2xl">
          Vista
        </div>
        <div className="text-vista-text absolute left-1/2 hidden -translate-x-1/2 gap-6 text-sm font-medium lg:flex xl:gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-vista-accent transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
        <button className="bg-vista-primary hover:bg-opacity-90 rounded-full px-4 py-2 text-sm font-medium text-white transition-all md:px-6 md:py-2.5">
          Get Started
        </button>
      </div>
    </nav>
  );
}
