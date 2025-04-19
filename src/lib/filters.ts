const ignoredPatterns = [
    'node_modules',
    '.git',
    'package-lock.json',
    'dist',
    '.env',
    'eslint.config.mjs',
    
    'yarn.lock',
    '__tests__',
    '.png',
    '.jpg',
    '.exe',
    '.zip'
  ]
  
  export function filterUsefulFiles(files: { path: string, content: string }[]) {
    return files.filter(file => {
      const path = file.path
      return !ignoredPatterns.some(pattern => path.includes(pattern))
    })
  }
  