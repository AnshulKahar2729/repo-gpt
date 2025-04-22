"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/utils/api";
import { useUserStore } from "@/store/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const res = await login(email, password);
      if (res.error) {
        setError(res.error);
        return;
      }
      setUser(res);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg mr-3 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">RepoGPT</span>
            </div>
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Welcome Back</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="you@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                  <Link href="#" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm bg-red-50 dark:bg-red-900/30 p-3 rounded-lg"
                >
                  {error}
                </motion.div>
              )}
              
              <Button 
                type="submit" 
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <span className="text-gray-600 dark:text-gray-400">Dont have an account?</span>
              <Link href="/signup" className="ml-1 text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium">
                Sign up
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 px-8 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
            By signing in, you agree to our 
            <Link href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 mx-1">
              Terms of Service
            </Link>
            and
            <Link href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 ml-1">
              Privacy Policy
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
