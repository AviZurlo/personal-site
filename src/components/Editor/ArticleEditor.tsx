import { useState, useEffect } from 'react';
import MarkdownEditor from './MarkdownEditor';

interface ArticleData {
  slug: string;
  content: string;
  frontmatter: {
    title: string;
    date: string;
    description: string;
    tags: string[];
    source: 'mirror' | 'x' | 'original';
    featured: boolean;
  };
}

interface ArticleEditorProps {
  slug: string;
}

export default function ArticleEditor({ slug }: ArticleEditorProps) {
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Frontmatter state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [source, setSource] = useState<'mirror' | 'x' | 'original'>('original');
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/content/articles/${slug}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load article');
        setLoading(false);
        return;
      }

      setArticle(data);
      setTitle(data.frontmatter.title);
      setDate(data.frontmatter.date);
      setDescription(data.frontmatter.description);
      setTags(data.frontmatter.tags.join(', '));
      setSource(data.frontmatter.source);
      setFeatured(data.frontmatter.featured);
      setLoading(false);
    } catch (err) {
      setError('Failed to load article');
      setLoading(false);
    }
  };

  const handleSave = async (content: string) => {
    const response = await fetch(`/api/content/articles/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        frontmatter: {
          title,
          date,
          description,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          source,
          featured,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save article');
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
        <p style={{ color: '#6b7280', fontSize: '15px' }}>Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
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
        <p style={{ color: '#dc2626', fontSize: '15px' }}>{error || 'Article not found'}</p>
        <a href="/admin" style={{ color: '#3b82f6', fontSize: '14px', textDecoration: 'none' }}>
          ← Back to Admin
        </a>
      </div>
    );
  }

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    color: '#374151',
    marginBottom: '6px'
  };

  const frontmatterEditor = (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#111827' }}>
        Article Metadata
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={labelStyle}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="robotics, AI, research"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Source</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as 'mirror' | 'x' | 'original')}
            style={inputStyle}
          >
            <option value="original">Original</option>
            <option value="x">X (Twitter)</option>
            <option value="mirror">Mirror</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', gridColumn: 'span 2' }}>
          <input
            type="checkbox"
            id="featured"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            style={{ width: '16px', height: '16px' }}
          />
          <label htmlFor="featured" style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
            Featured article
          </label>
        </div>
      </div>
    </div>
  );

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
          Editing: {article.slug}
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
        initialContent={article.content}
        onSave={handleSave}
        frontmatterEditor={frontmatterEditor}
      />
    </div>
  );
}
