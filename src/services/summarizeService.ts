// Mock summarization and term extraction.
// In production, integrate with your AI provider and langextract.

export function chunkText(text: string, chunkSize = 300): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const chunks: string[] = []
  let buffer: string[] = []
  for (const w of words) {
    buffer.push(w)
    if (buffer.join(' ').length >= chunkSize) {
      chunks.push(buffer.join(' '))
      buffer = []
    }
  }
  if (buffer.length) chunks.push(buffer.join(' '))
  return chunks
}

export async function summarizeText(text: string): Promise<string> {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean)
  const top = sentences.slice(0, 2).join(' ')
  return `Summary: ${top || 'No content provided.'} Plain-English: This is a concise explanation of the document focusing on key obligations and rights.`
}

export function extractTerms(text: string): string[] {
  // naive keyword extraction as a stand-in for langextract
  const keyCandidates = ['indemnify', 'jurisdiction', 'confidentiality', 'arbitration', 'late fee', 'termination', 'renewal', 'notice']
  const lower = text.toLowerCase()
  return keyCandidates.filter(k => lower.includes(k))
}
