import { chunkFileWithGemini } from '@/lib/chunker'
import { embedChunkWithGemini } from '@/lib/embedder'
import { filterUsefulFiles } from '@/lib/filters'
import { cloneRepoAndGetFiles, deleteRepoDirectory } from '@/lib/git'
import { rateLimit } from '@/lib/rateLimiter'
import { storeChunksInVectorDB } from '@/lib/vector'
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/utils/auth';
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    console.log('[INGEST] Starting repository ingestion process');
    const { repoUrl } = await req.json()
    if (!repoUrl) {
      console.log('[INGEST] Error: Missing repo URL');
      return NextResponse.json({ error: 'Missing repo URL' }, { status: 400 })
    }
    console.log(`[INGEST] Processing repository: ${repoUrl}`);

    const token = req.cookies.get('token')?.value;
    if (!token) {
      console.log('[INGEST] Error: Unauthorized - No token provided');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await getUserFromToken(token);
    if (!user) {
      console.log('[INGEST] Error: User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.log(`[INGEST] User authenticated: ${user.id}`);

    // Extract repo name from URL
    const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 'unknown-repo';
    console.log(`[INGEST] Repository name: ${repoName}`);

    // Create or update project in database
    console.log(`[INGEST] Creating/updating project in database`);
    const project = await prisma.project.upsert({
      where: {
        repoUrl_userId: {
          repoUrl,
          userId: user.id
        }
      },
      update: { name: repoName },
      create: {
        repoUrl,
        name: repoName,
        userId: user.id
      }
    })
    console.log(`[INGEST] Project created/updated with ID: ${project.id}`);

    // Pass userId and projectId to the clone function
    console.log(`[INGEST] Cloning repository and getting files`);
    const files = await cloneRepoAndGetFiles(repoUrl, user.id, project.id)
    console.log(`[INGEST] Total files retrieved: ${files.length}`);
    
    const usefulFiles = filterUsefulFiles(files)
    console.log(`[INGEST] Filtered to ${usefulFiles.length} useful files`);

    const allChunks = []
    let chunkCount = 0;
    let embeddingCount = 0;

    for (const file of usefulFiles) {
      try {
        console.log(`[INGEST] Processing file: ${file.path}`);
        
        // Apply rate limiting before calling Gemini for chunking
        await rateLimit()
        console.log(`[INGEST] Chunking file with Gemini: ${file.path}`);
        const chunks = await chunkFileWithGemini(file)
        console.log(`[INGEST] File chunked into ${chunks.length} chunks`);
        chunkCount += chunks.length;
        
        for (const chunk of chunks) {
          try {
            // Apply rate limiting before calling Gemini for embedding
            await rateLimit()
            console.log(`[INGEST] Generating embedding for chunk: ${chunk.chunk_id}`);
            const embedding = await embedChunkWithGemini(chunk.code)
            console.log(`[INGEST] Embedding generated successfully. Vector length: ${embedding.length}`);
            
            if (!embedding || embedding.length === 0) {
              console.error(`[INGEST] Error: Empty embedding generated for chunk ${chunk.chunk_id}`);
              continue;
            }
            
            allChunks.push({ ...chunk, embedding })
            embeddingCount++;
          } catch (embeddingError) {
            console.error(`[INGEST] Error generating embedding for chunk ${chunk.chunk_id}:`, embeddingError);
          }
        }
      } catch (error) {
        console.error(`[INGEST] Error processing file ${file.path}:`, error)
        // Continue with next file instead of failing the entire process
      }
    }

    console.log(`[INGEST] Total chunks created: ${chunkCount}`);
    console.log(`[INGEST] Total embeddings generated: ${embeddingCount}`);
    console.log(`[INGEST] Storing ${allChunks.length} chunks in vector database`);
    
    if (allChunks.length === 0) {
      console.error('[INGEST] Warning: No chunks to store in vector database');
    }

    await storeChunksInVectorDB(repoUrl, allChunks)
    console.log(`[INGEST] Chunks stored in vector database successfully`);

    // Delete the repository directory after successful ingestion
    try {
      console.log(`[INGEST] Cleaning up repository directory`);
      await deleteRepoDirectory(user.id, project.id);
      console.log(`[INGEST] Repository directory deleted successfully`);
    } catch (cleanupError) {
      console.error('[INGEST] Error during repository cleanup:', cleanupError);
      // Continue with the response even if cleanup fails
    }

    console.log(`[INGEST] Repository ingestion completed successfully`);
    return NextResponse.json({ 
      message: 'Repo processed and stored!',
      stats: {
        totalFiles: files.length,
        usefulFiles: usefulFiles.length,
        totalChunks: chunkCount,
        embeddingsGenerated: embeddingCount,
        chunksStored: allChunks.length
      }
    })
  } catch (error) {
    console.error('[INGEST] Unhandled error during ingestion process:', error);
    return NextResponse.json({ 
      error: 'An error occurred during ingestion',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
