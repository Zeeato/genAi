import { useRef, useState } from 'react'

type Props = {
  onText: (text: string) => void
}

export default function FileDrop({ onText }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string>('')

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0] as File

    // Validate PDF only
    const isPdfByMime = file.type === 'application/pdf'
    const isPdfByExt = file.name.toLowerCase().endsWith('.pdf')
    if (!isPdfByMime && !isPdfByExt) {
      setError('Only PDF files are allowed.')
      return
    }

    setError('')

    // Note: Reading a PDF as text will not extract human-readable content.
    // If PDF text extraction is needed, integrate a PDF parser (e.g., pdfjs-dist) here.
    const text = await file.text()
    onText(text)
  }

  return (
    <div
      className="border rounded p-4 text-center bg-body-tertiary"
      onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
      onDrop={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        handleFiles(e.dataTransfer.files)
      }}
    >
      <p className="mb-3"><i className="bi bi-file-earmark-pdf text-primary fs-1"></i></p>
      <h5 className="mb-3">Drop a PDF document here</h5>
      <p className="text-secondary mb-3">Only PDF files are accepted</p>
      <div className="d-flex gap-2 justify-content-center">
        <button className="btn btn-primary" onClick={() => inputRef.current?.click()}>
          <i className="bi bi-upload me-2"></i>Browse Files
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="d-none"
        accept=".pdf,application/pdf"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
      />
      {error && (
        <p className="text-danger mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
