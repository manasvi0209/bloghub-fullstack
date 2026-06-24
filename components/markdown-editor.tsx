import { marked } from 'marked'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your content here (supports markdown)...',
  minHeight = 'h-32',
}: MarkdownEditorProps) {
  const preview = marked(value, {
    breaks: true,
    gfm: true,
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Editor */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">
            Content (Markdown)
          </label>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full p-3 rounded-lg border border-border bg-background text-foreground resize-vertical focus:outline-none focus:ring-2 focus:ring-primary ${minHeight}`}
          />
          <p className="text-xs text-muted-foreground">
            Supports **bold**, *italic*, [links](url), etc.
          </p>
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-2 hidden md:flex">
          <label className="text-sm font-semibold text-foreground">
            Preview
          </label>
          <div
            className={`w-full p-3 rounded-lg border border-border bg-muted/30 text-foreground overflow-auto ${minHeight} prose prose-sm dark:prose-invert max-w-none`}
            dangerouslySetInnerHTML={{ __html: preview as string }}
          />
        </div>
      </div>

      {/* Mobile Preview */}
      {value && (
        <div className="md:hidden border border-border rounded-lg p-3 bg-muted/30">
          <p className="text-sm font-semibold mb-2 text-foreground">Preview:</p>
          <div
            className="prose prose-sm dark:prose-invert max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: preview as string }}
          />
        </div>
      )}
    </div>
  )
}
