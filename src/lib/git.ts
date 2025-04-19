import simpleGit from 'simple-git'
import fs from 'fs/promises'
import path from 'path'

export async function cloneRepoAndGetFiles(repoUrl: string, userId?: string, projectId?: string): Promise<{ path: string, content: string }[]> {
  // Create a structured path with userId/projectId if provided
  let clonePath: string;
  
  if (userId && projectId) {
    // Create project directory structure in the project root
    clonePath = path.join(process.cwd(), 'repos', userId, projectId);
    
    // Ensure the directory exists
    await fs.mkdir(clonePath, { recursive: true });
  } else {
    // Fallback to temporary directory if userId or projectId not provided
    clonePath = `/tmp/${Math.random().toString(36).substring(2)}`;
  }
  
  // Clone the repository
  await simpleGit().clone(repoUrl, clonePath);

  const getAllFiles = async (dir: string): Promise<string[]> => {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const files = await Promise.all(entries.map(entry => {
      const fullPath = path.join(dir, entry.name)
      return entry.isDirectory() ? getAllFiles(fullPath) : fullPath
    }))
    return files.flat()
  }

  const filePaths = await getAllFiles(clonePath)

  return await Promise.all(
    filePaths.map(async (filePath) => ({
      path: filePath,
      content: await fs.readFile(filePath, 'utf-8').catch(err => {
        // Handle binary files or other read errors gracefully
        console.error(`Error reading file ${filePath}:`, err);
        return ''; // Return empty string for files that can't be read as text
      })
    }))
  )
}
