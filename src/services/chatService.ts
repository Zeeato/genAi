export async function askQuestion(question: string, context: string): Promise<string> {
  // Mocked assistant response using simple heuristics
  if (!context.trim()) {
    return 'Please provide some document context on the left so I can give clause-specific answers.'
  }
  const hasLateFee = /late fee|late fees/i.test(context)
  if (/termination/i.test(question)) {
    return 'Termination typically allows either party to end the agreement under certain conditions. In your text, look for notice periods and penalties.'
  }
  if (hasLateFee && /late/i.test(question)) {
    return 'The document mentions a late fee. Check the grace period, percentage or fixed amount, and any cap.'
  }
  return 'Based on the provided context, this clause appears standard. Consider confirming obligations, timelines, and dispute resolution.'
}
