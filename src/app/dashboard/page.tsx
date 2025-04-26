"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useUserStore();

  // useEffect(() => {
  //   async function load() {
  //     const profile = await fetchProfile();
  //     if (!profile) {
  //       router.replace("/login");
  //       return;
  //     }
  //     setUser(profile);
  //   }
  //   load();
  //   // eslint-disable-next-line
  // }, []);
  const [repos, setRepos] = useState<{ id: string; name: string; repoUrl: string }[]>([])
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchProjects = async () => {
    setLoading(true)
    const res = await fetch('/api/my-projects')
    const data = await res.json()
    setRepos(data.projects || [])
    setLoading(false)
  }

  const ingest = async () => {
    await fetch('/api/ingest', {
      method: 'POST',
      body: JSON.stringify({ repoUrl: url }),
      headers: { 'Content-Type': 'application/json' }
    })
    setUrl('')
    fetchProjects()
  }

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to project page
    e.stopPropagation(); // Prevent event bubbling
    
    setDeleting(id);
    
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        // Remove the project from the local state
        setRepos(repos.filter(repo => repo.id !== id));
      } else {
        const data = await res.json();
        console.error(`Failed to delete project: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => { fetchProjects() }, [])

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name || user.email}!</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Project</h2>
        <div className="flex gap-2 max-w-xl">
          <input
            className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/user/repo"
          />
          <button 
            onClick={ingest} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ingest
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Your Projects</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : repos.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No projects yet. Add your first GitHub repository above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map(repo => (
              <Link 
                key={repo.id} 
                href={`/projects/${repo.id}`}
                className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">{repo.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{repo.repoUrl}</p>
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={(e) => deleteProject(repo.id, e)}
                    className="text-red-500 hover:text-red-700 text-sm flex items-center"
                    disabled={deleting === repo.id}
                  >
                    {deleting === repo.id ? (
                      <span className="flex items-center">
                        <span className="animate-spin h-4 w-4 mr-1 border-b-2 border-red-500 rounded-full"></span>
                        Deleting...
                      </span>
                    ) : (
                      <span>Delete</span>
                    )}
                  </button>
                  <span className="text-blue-500 text-sm">View project →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
