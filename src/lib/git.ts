import simpleGit from 'simple-git'
import fs from 'fs/promises'
import path from 'path'

export async function cloneRepoAndGetFiles(repoUrl: string): Promise<{ path: string, content: string }[]> {
  const tempPath = `/tmp/${Math.random().toString(36).substring(2)}`
  await simpleGit().clone(repoUrl, tempPath)

  const getAllFiles = async (dir: string): Promise<string[]> => {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const files = await Promise.all(entries.map(entry => {
      const fullPath = path.join(dir, entry.name)
      return entry.isDirectory() ? getAllFiles(fullPath) : fullPath
    }))
    return files.flat()
  }

  const filePaths = await getAllFiles(tempPath)

  return await Promise.all(
    filePaths.map(async (filePath) => ({
      path: filePath,
      content: await fs.readFile(filePath, 'utf-8')
    }))
  )
}
