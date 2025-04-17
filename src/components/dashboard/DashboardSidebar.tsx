import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-2 py-8 px-4">
      <div className="mb-8 text-2xl font-extrabold text-primary-600">MyApp</div>
      {navLinks.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-lg font-medium transition-colors hover:bg-primary-100 dark:hover:bg-primary-900/40 ${pathname === link.href ? "bg-primary-200 dark:bg-primary-900/60 text-primary-900 dark:text-primary-100" : "text-gray-700 dark:text-gray-300"}`}
        >
          <span>{link.icon}</span>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
