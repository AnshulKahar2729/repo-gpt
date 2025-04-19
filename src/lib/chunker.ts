import { Chunk } from "./types"
import { callGemini } from "./gemini"

export async function chunkFileWithGemini(file: { path: string, content: string }): Promise<Chunk[]> {
  const { path, content } = file;
  const fileSize = content.length;
  const fileExtension = path.split('.').pop()?.toLowerCase() || '';
  
  // File size thresholds
  const SMALL_FILE_THRESHOLD = 5000;  // ~5KB
  
  // 1. For small files, don't chunk at all
  if (fileSize <= SMALL_FILE_THRESHOLD) {
    return [{
      code: content,
      name: path.split('/').pop() || '',
      type: 'file',
      file: path,
      chunk_id: 0
    }];
  }
  
  // 2. For markdown/documentation files, chunk by headers
  if (['md', 'mdx', 'txt', 'rst', 'adoc'].includes(fileExtension)) {
    // Match headers in markdown (# Header)
    const headerRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches = [...content.matchAll(headerRegex)];
    
    // If headers found, chunk by headers
    if (matches.length > 0) {
      const chunks: Chunk[] = [];
      
      // Process each header section
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const headerStart = match.index!;
        const headerLevel = match[1].length;
        const headerText = match[2];
        
        // Find the end of this section (next header or end of file)
        const nextMatch = matches[i + 1];
        const sectionEnd = nextMatch ? nextMatch.index! : content.length;
        
        // Extract the section content
        const sectionContent = content.substring(headerStart, sectionEnd);
        
        chunks.push({
          code: sectionContent,
          name: headerText,
          type: `h${headerLevel}`,
          file: path,
          chunk_id: i
        });
      }
      
      // Add a chunk for any content before the first header
      if (matches[0].index! > 0) {
        const preamble = content.substring(0, matches[0].index!);
        chunks.unshift({
          code: preamble,
          name: 'Preamble',
          type: 'section',
          file: path,
          chunk_id: chunks.length
        });
      }
      
      return chunks;
    }
  }
  
  // 3. For large files, use overlapping windows
  if (fileSize > 20000) { // ~20KB
    const chunks: Chunk[] = [];
    const WINDOW_SIZE = 3000;  // ~3KB per window
    const OVERLAP_SIZE = 500;  // ~500 bytes overlap
    
    let position = 0;
    let chunkId = 0;
    
    while (position < content.length) {
      // Calculate window end position
      const windowEnd = Math.min(position + WINDOW_SIZE, content.length);
      
      // Extract window content
      const windowContent = content.substring(position, windowEnd);
      
      // Create chunk
      chunks.push({
        code: windowContent,
        name: `${path.split('/').pop() || ''} (window ${chunkId + 1})`,
        type: 'window',
        file: path,
        chunk_id: chunkId++
      });
      
      // Move position for next window, with overlap
      position = windowEnd - OVERLAP_SIZE;
      
      // Ensure we make progress
      if (position <= 0 || windowEnd === content.length) {
        break;
      }
    }
    
    return chunks;
  }
  
  // 4. Default: Use Gemini for semantic chunking
  const prompt = `
You are an expert code assistant. Chunk the following file into logical code blocks (functions, classes, etc.).
Return a JSON array of objects like:
[{ "name": "functionName", "type": "function", "code": "..." }]

Only return the array. Here's the file:
\`\`\`
${file.content}
\`\`\`
  `
  const response = await callGemini(prompt)
  
  // Extract JSON from markdown if needed
  let jsonContent = response
  
  // Check if response is wrapped in markdown code blocks
  const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/
  const match = response.match(jsonRegex)
  
  if (match && match[1]) {
    jsonContent = match[1].trim()
  }
  
  try {
    const chunks: Chunk[] = JSON.parse(jsonContent)
    return chunks.map((chunk, idx) => ({
      ...chunk,
      file: file.path,
      chunk_id: idx
    }))
  } catch (error: unknown) {
    console.error('Error parsing JSON from Gemini response:', error)
    console.error('Raw response:', response)
    
    // Fall back to overlapping windows on error
    console.log('Falling back to overlapping windows chunking')
    
    // Use overlapping windows as fallback
    const chunks: Chunk[] = [];
    const WINDOW_SIZE = 3000;
    const OVERLAP_SIZE = 500;
    
    let position = 0;
    let chunkId = 0;
    
    while (position < content.length) {
      const windowEnd = Math.min(position + WINDOW_SIZE, content.length);
      const windowContent = content.substring(position, windowEnd);
      
      chunks.push({
        code: windowContent,
        name: `${path.split('/').pop() || ''} (window ${chunkId + 1})`,
        type: 'window',
        file: path,
        chunk_id: chunkId++
      });
      
      position = windowEnd - OVERLAP_SIZE;
      if (position <= 0 || windowEnd === content.length) break;
    }
    
    return chunks;
  }
}

export async function askGeminiWithContext(question: string, chunks: Chunk[]): Promise<string> {
  // Join chunks with clear section markers to help with context
  const context = chunks.map(c => {
    const name = c.name ? `${c.name} (${c.type})` : `${c.file.split('/').pop() || ''} (${c.type})`;
    return `--- ${name} ---\n${c.code}`;
  }).join('\n\n');
  
  const prompt = `Answer this question using the context below:

Context:
${context}

Question:
${question}
`
  return await callGemini(prompt)
}
