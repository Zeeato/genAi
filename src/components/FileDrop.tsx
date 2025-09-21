import { useRef } from 'react'

type Props = {
  onText: (text: string) => void
}

export default function FileDrop({ onText }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0] as File
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
      <p className="mb-2">Drop a document here or</p>
      <div className="d-flex gap-2 justify-content-center">
        <button className="btn btn-outline-primary" onClick={() => inputRef.current?.click()}>
          Browse Files
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="d-none"
        accept=".txt,.md,.pdf,.doc,.docx,.rtf"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
      />
    </div>
  )
}
