import simpleGit from 'simple-git'
import fs from 'fs/promises'
import path from 'path'
import { rimraf } from 'rimraf'

export async function cloneRepoAndGetFiles(repoUrl: string, userId?: string, projectId?: string): Promise<{ path: string, content: string }[]> {
  // Create a structured path with userId/projectId if provided
  let clonePath: string;
  
  if (userId && projectId) {
    // Create project directory structure in the project root
    clonePath = path.join(process.cwd(), 'repos', userId, projectId);
    
    // Ensure the directory exists
    await fs.mkdir(clonePath, { recursive: true });
    console.log(`[CLONE] Created directory: ${clonePath}`);
  } else {
    // Fallback to temporary directory if userId or projectId not provided
    clonePath = `/tmp/${Math.random().toString(36).substring(2)}`;
    console.log(`[CLONE] Using temporary directory: ${clonePath}`);
  }
  
  // Clone the repository
  console.log(`[CLONE] Cloning repository: ${repoUrl} to ${clonePath}`);
  await simpleGit().clone(repoUrl, clonePath);
  console.log(`[CLONE] Repository cloned successfully`);

  const getAllFiles = async (dir: string): Promise<string[]> => {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const files = await Promise.all(entries.map(entry => {
      const fullPath = path.join(dir, entry.name)
      return entry.isDirectory() ? getAllFiles(fullPath) : fullPath
    }))
    return files.flat()
  }

  console.log(`[CLONE] Scanning for files in ${clonePath}`);
  const filePaths = await getAllFiles(clonePath)
  console.log(`[CLONE] Found ${filePaths.length} files`);

  const fileContents = await Promise.all(
    filePaths.map(async (filePath) => ({
      path: filePath,
      content: await fs.readFile(filePath, 'utf-8').catch(err => {
        // Handle binary files or other read errors gracefully
        console.error(`[CLONE] Error reading file ${filePath}:`, err);
        return ''; // Return empty string for files that can't be read as text
      })
    }))
  );
  
  console.log(`[CLONE] Successfully read ${fileContents.length} files`);
  return fileContents;
}

/**
 * Deletes a repository directory from the file system
 * @param userId - The user ID
 * @param projectId - The project ID
 * @returns A promise that resolves when the directory is deleted
 */
export async function deleteRepoDirectory(userId: string, projectId: string): Promise<void> {
  const repoPath = path.join(process.cwd(), 'repos', userId, projectId);
  console.log(`[DELETE] Deleting repository directory: ${repoPath}`);
  
  try {
    // Using rimraf for more reliable directory deletion
    await rimraf(repoPath);
    console.log(`[DELETE] Repository directory deleted successfully: ${repoPath}`);
  } catch (error) {
    console.error(`[DELETE] Error deleting repository directory: ${repoPath}`, error);
    throw error;
  }
}
