import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import ReactMarkdown from 'react-markdown';
import { imageUploadExtension } from './imageUploadExtension';

interface MarkdownEditorProps {
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  frontmatterEditor?: React.ReactNode;
  slug?: string;
}

export default function MarkdownEditor({
  initialContent,
  onSave,
  frontmatterEditor,
  slug
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showMetadata, setShowMetadata] = useState(false);
  const [uploading, setUploading] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      await onSave(content);
      setMessage({ type: 'success', text: 'Saved!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    if (!slug) {
      setMessage({ type: 'error', text: 'No article slug available' });
      return null;
    }

    setUploading(true);
    setMessage({ type: 'success', text: 'Uploading image...' });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slug', slug);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setMessage({ type: 'success', text: 'Image uploaded!' });
      setTimeout(() => setMessage(null), 2000);
      return data.url;
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image' });
      return null;
    } finally {
      setUploading(false);
    }
  }, [slug]);

  // Create CodeMirror extension for image upload
  const imageExtension = useMemo(
    () =>
      imageUploadExtension({
        uploadImage,
        onUploadStart: () => setUploading(true),
        onUploadEnd: () => setUploading(false)
      }),
    [uploadImage]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
        background: 'white',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {frontmatterEditor && (
            <button
              onClick={() => setShowMetadata(!showMetadata)}
              style={{
                padding: '6px 12px',
                fontSize: '14px',
                background: showMetadata ? '#3b82f6' : '#f3f4f6',
                color: showMetadata ? 'white' : '#374151',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {showMetadata ? 'Hide' : 'Show'} Metadata
            </button>
          )}
          {message && (
            <span style={{
              fontSize: '14px',
              color: message.type === 'success' ? '#059669' : '#dc2626'
            }}>
              {message.text}
            </span>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '8px 20px',
            fontSize: '14px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.6 : 1,
            fontWeight: 500
          }}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Metadata Panel */}
      {frontmatterEditor && showMetadata && (
        <div style={{
          padding: '16px',
          background: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          maxHeight: '40vh',
          overflow: 'auto',
          flexShrink: 0
        }}>
          {frontmatterEditor}
        </div>
      )}

      {/* Editor Split View */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        minHeight: 0,
        width: '100%'
      }}>
        {/* Markdown Source */}
        <div style={{
          width: '50%',
          minWidth: 0,
          maxWidth: '50%',
          overflow: 'hidden',
          borderRight: '1px solid #e5e7eb',
          background: '#fafafa',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            flex: 1,
            overflow: 'auto',
            minWidth: 0
          }}>
            <CodeMirror
              value={content}
              height="100%"
              width="100%"
              extensions={[
                markdown(),
                EditorView.lineWrapping,
                imageExtension
              ]}
              onChange={(value) => setContent(value)}
              style={{
                height: '100%',
                fontSize: '14px',
                width: '100%'
              }}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                highlightActiveLine: true,
                foldGutter: true
              }}
            />
          </div>
        </div>

        {/* Preview */}
        <div style={{
          width: '50%',
          minWidth: 0,
          maxWidth: '50%',
          overflow: 'auto',
          padding: '24px',
          background: 'white'
        }}>
          <div style={{
            fontSize: '15px',
            lineHeight: '1.7',
            color: '#374151',
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
