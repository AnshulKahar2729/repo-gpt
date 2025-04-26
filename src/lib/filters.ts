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
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.webp',
    '.bmp',
    '.tiff',
    '.ttf',
    '.woff',
    '.woff2',
    '.eot',
    '.otf',
    '.mp3',
    '.mp4',
    '.webm',
    '.wav',
    '.ogg',
    '.pdf',
    '.exe',
    '.zip'
  ]
  
  export function filterUsefulFiles(files: { path: string, content: string }[]) {
    return files.filter(file => {
      const path = file.path
      return !ignoredPatterns.some(pattern => path.includes(pattern))
    })
  }