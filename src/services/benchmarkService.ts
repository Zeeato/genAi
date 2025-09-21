type Input = { address: string; rent: number; beds: number; baths: number }

export async function compareRent(input: Input): Promise<{ marketAvg: number; delta: number; verdict: string }> {
  // Mock: derive a pseudo market average from beds/baths and a hash of address length
  const base = 800 + input.beds * 350 + input.baths * 250 + (input.address.length % 100)
  const noise = (Math.sin(input.address.length) + 1) * 50
  const marketAvg = Math.round(base + noise)
  const delta = input.rent - marketAvg
  const verdict = delta > 100 ? 'Above market — consider negotiating a lower rent.' : delta < -100 ? 'Below market — this is a favorable rate.' : 'Near market — price seems reasonable.'
  return { marketAvg, delta, verdict }
}
