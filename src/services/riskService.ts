type Flag = { clause: string; severity: 'low' | 'medium' | 'high'; note: string }

export async function analyzeRisk(text: string): Promise<Flag[]> {
  const flags: Flag[] = []
  const lower = text.toLowerCase()
  if (lower.includes('indemnify')) flags.push({ clause: 'Indemnification', severity: 'high', note: 'Broad indemnification may shift significant risk to you.' })
  if (lower.includes('late fee')) flags.push({ clause: 'Late Fees', severity: 'medium', note: 'Check if the late fee is capped and the grace period is reasonable.' })
  if (lower.includes('automatic renewal')) flags.push({ clause: 'Auto-Renewal', severity: 'medium', note: 'Ensure notification windows to cancel are practical.' })
  if (lower.includes('arbitration')) flags.push({ clause: 'Arbitration', severity: 'low', note: 'Arbitration can limit litigation; review costs and venue.' })
  if (flags.length === 0) flags.push({ clause: 'No obvious risks', severity: 'low', note: 'No standard red flags detected. Manual review still recommended.' })
  return flags
}
