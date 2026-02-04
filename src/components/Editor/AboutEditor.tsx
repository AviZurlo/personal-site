import { useState, useEffect } from 'react';
import MarkdownEditor from './MarkdownEditor';

interface PageData {
  content: string;
  frontmatter?: {
    title?: string;
  };
}

export default function AboutEditor() {
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = async () => {
    try {
      const response = await fetch('/api/content/about');
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load page');
        setLoading(false);
        return;
      }

      setPage(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load page');
      setLoading(false);
    }
  };

  const handleSave = async (content: string) => {
    const response = await fetch('/api/content/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        frontmatter: page?.frontmatter,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save page');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#fafafa'
      }}>
        <p style={{ color: '#6b7280', fontSize: '15px' }}>Loading page...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#fafafa',
        gap: '16px'
      }}>
        <p style={{ color: '#dc2626', fontSize: '15px' }}>{error || 'Page not found'}</p>
        <a href="/admin" style={{ color: '#3b82f6', fontSize: '14px', textDecoration: 'none' }}>
          ← Back to Admin
        </a>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{
        background: '#1f2937',
        color: 'white',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <h1 style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>
          Editing: About Page
        </h1>
        <a
          href="/admin"
          style={{
            fontSize: '14px',
            color: '#d1d5db',
            textDecoration: 'none',
            border: 'none'
          }}
        >
          ← Back to Admin
        </a>
      </div>
      <MarkdownEditor
        initialContent={page.content}
        onSave={handleSave}
      />
    </div>
  );
}
