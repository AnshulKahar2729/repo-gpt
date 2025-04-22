"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { User } from "@/store/user";

interface ProfileTabsProps {
  user: User;
}

export default function ProfileTabs({ user }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "projects", label: "Projects" },
    { id: "activity", label: "Activity" },
    { id: "settings", label: "Settings" }
  ];

  return (
    <div className="mb-8">
      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === tab.id
                ? "text-primary-600 border-b-2 border-primary-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        {activeTab === "overview" && <OverviewTab user={user} />}
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "activity" && <ActivityTab />}
        {activeTab === "settings" && <SettingsTab user={user} />}
      </div>
    </div>
  );
}

function OverviewTab({ user }: { user: User }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Profile Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Account Information</h3>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Name</div>
              <div className="font-medium text-gray-900 dark:text-white">{user.name || "Not provided"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
              <div className="font-medium text-gray-900 dark:text-white">{user.email}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Member Since</div>
              <div className="font-medium text-gray-900 dark:text-white">April 2023</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Subscription</div>
              <div className="font-medium text-gray-900 dark:text-white">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Pro Plan
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {i === 1 ? "Created a new project" : i === 2 ? "Analyzed repository" : "Updated project settings"}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {i === 1 ? "2 hours ago" : i === 2 ? "Yesterday" : "3 days ago"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Usage Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "API Calls", value: "1,248", color: "bg-blue-500" },
            { label: "Storage Used", value: "3.2 GB", color: "bg-purple-500" },
            { label: "Projects Created", value: "12", color: "bg-green-500" },
            { label: "Analyses Run", value: "48", color: "bg-yellow-500" }
          ].map((stat, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className={`w-12 h-2 ${stat.color} rounded-full mb-2`}></div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectsTab() {
  const projects = [
    { id: 1, name: "E-commerce Platform", language: "TypeScript", lastUpdated: "2 hours ago", status: "active" },
    { id: 2, name: "Personal Blog", language: "JavaScript", lastUpdated: "Yesterday", status: "active" },
    { id: 3, name: "Weather App", language: "React", lastUpdated: "3 days ago", status: "inactive" },
    { id: 4, name: "Task Manager", language: "Vue.js", lastUpdated: "1 week ago", status: "active" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Projects</h2>
        <button className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors">
          New Project
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Language</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Updated</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900 dark:text-white">{project.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{project.language}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{project.lastUpdated}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {project.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400 mr-3">View</button>
                  <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function ActivityTab() {
  const activities = [
    { id: 1, type: "project_created", project: "E-commerce Platform", time: "2 hours ago" },
    { id: 2, type: "analysis_completed", project: "E-commerce Platform", time: "2 hours ago" },
    { id: 3, type: "commit_pushed", project: "Personal Blog", time: "Yesterday" },
    { id: 4, type: "project_updated", project: "Weather App", time: "3 days ago" },
    { id: 5, type: "analysis_completed", project: "Task Manager", time: "1 week ago" }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "project_created":
        return (
          <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case "analysis_completed":
        return (
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        );
      case "commit_pushed":
        return (
          <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        );
    }
  };

  const getActivityText = (type: string) => {
    switch (type) {
      case "project_created":
        return "Created project";
      case "analysis_completed":
        return "Completed analysis for";
      case "commit_pushed":
        return "Pushed commits to";
      case "project_updated":
        return "Updated project";
      default:
        return "Interacted with";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Activity History</h2>
      
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex">
            <div className="mr-4">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {getActivityText(activity.type)}
                  </span>
                  <span className="ml-1 font-medium text-primary-600 dark:text-primary-400">
                    {activity.project}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.time}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {activity.type === "analysis_completed" && "Code quality score: 92/100"}
                {activity.type === "commit_pushed" && "3 commits pushed to main branch"}
                {activity.type === "project_created" && "Initial repository setup completed"}
                {activity.type === "project_updated" && "Updated project configuration"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SettingsTab({ user }: { user: User }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Account Settings</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                defaultValue={user.name || ""}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                defaultValue={user.email}
                readOnly
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input 
                id="emailNotifications" 
                type="checkbox" 
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Email notifications
              </label>
            </div>
            <div className="flex items-center">
              <input 
                id="darkMode" 
                type="checkbox" 
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Dark mode
              </label>
            </div>
            <div className="flex items-center">
              <input 
                id="twoFactor" 
                type="checkbox" 
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="twoFactor" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Enable two-factor authentication
              </label>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </motion.div>
  );
}
