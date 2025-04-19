import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/my-projects');
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <nav className="flex flex-col gap-2 py-8 px-4">
      <div className="mb-8 text-2xl font-extrabold text-primary-600">RepoGPT</div>
      
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

      {projects.length > 0 && (
        <div className="mt-6">
          <div className="text-xs uppercase text-gray-500 font-semibold mb-2 px-4">Projects</div>
          <div className="space-y-1 max-h-[300px] overflow-y-auto">
            {projects.map(project => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-primary-100 dark:hover:bg-primary-900/40 ${pathname === `/projects/${project.id}` ? "bg-primary-200 dark:bg-primary-900/60 text-primary-900 dark:text-primary-100" : "text-gray-700 dark:text-gray-300"}`}
              >
                <span>📁</span>
                <span className="truncate">{project.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
