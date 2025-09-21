# LexiAI (Frontend Only)

LexiAI is a responsive Vite + React + TypeScript + Bootstrap web app that showcases:

- Document Summarization & Chunking (mocked; placeholder for langextract + LLM)
- Interactive Q&A Chatbot (mocked)
- Real-Time Rental Benchmarking (mocked)
- Risk Factor Analysis (mocked)

This is a frontend-only demo with mock services. Replace mocks in `src/services/*` with real backends as needed.

## Quickstart

Prerequisites: Node.js 18+

```pwsh
# Install deps
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

- `src/pages/*`: Pages for each feature
- `src/components/*`: Reusable UI components (e.g., file drop)
- `src/services/*`: Mock service implementations to simulate backend/AI
- `src/styles/theme.css`: Custom theme colors and chat styles

## Theming

Primary: Indigo-Blue; Accent: Teal. Easily tweak in `src/styles/theme.css`.

## Notes

- Summarization uses a naive split and top-sentence pick as a placeholder. Swap with real AI + `langextract` on the server.
- Benchmarking uses simple math to simulate an API response.
- Risk analysis scans for common terms and returns mock flags.
