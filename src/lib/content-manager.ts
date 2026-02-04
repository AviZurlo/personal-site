import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = join(process.cwd(), 'src', 'content');
const ARTICLES_DIR = join(CONTENT_DIR, 'articles');

export interface ArticleData {
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

export interface PageData {
  content: string;
  frontmatter?: {
    title?: string;
  };
}

// Sanitize slug to prevent directory traversal
function sanitizeSlug(slug: string): string {
  return slug.replace(/[^a-zA-Z0-9-_().\s]/g, '');
}

export async function listArticles(): Promise<string[]> {
  const files = await readdir(ARTICLES_DIR);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace('.md', ''));
}

export async function getArticle(slug: string): Promise<ArticleData | null> {
  try {
    const sanitizedSlug = sanitizeSlug(slug);
    const filePath = join(ARTICLES_DIR, `${sanitizedSlug}.md`);
    const fileContent = await readFile(filePath, 'utf-8');

    const { data, content } = matter(fileContent);

    return {
      slug: sanitizedSlug,
      content,
      frontmatter: {
        title: data.title,
        date: data.date instanceof Date ? data.date.toISOString().split('T')[0] : data.date,
        description: data.description,
        tags: data.tags || [],
        source: data.source,
        featured: data.featured || false,
      },
    };
  } catch (error) {
    console.error('Error reading article:', error);
    return null;
  }
}

export async function updateArticle(slug: string, data: Partial<ArticleData>): Promise<boolean> {
  try {
    const sanitizedSlug = sanitizeSlug(slug);
    const filePath = join(ARTICLES_DIR, `${sanitizedSlug}.md`);

    // Read existing file
    const existing = await getArticle(sanitizedSlug);
    if (!existing) return false;

    // Merge updates
    const updatedFrontmatter = {
      ...existing.frontmatter,
      ...(data.frontmatter || {}),
    };

    const updatedContent = data.content !== undefined ? data.content : existing.content;

    // Write back
    const fileContent = matter.stringify(updatedContent, updatedFrontmatter);
    await writeFile(filePath, fileContent, 'utf-8');

    return true;
  } catch (error) {
    console.error('Error updating article:', error);
    return false;
  }
}

export async function getPage(pageName: string): Promise<PageData | null> {
  try {
    const sanitizedName = sanitizeSlug(pageName);
    const filePath = join(CONTENT_DIR, `${sanitizedName}.md`);
    const fileContent = await readFile(filePath, 'utf-8');

    const { data, content } = matter(fileContent);

    return {
      content,
      frontmatter: data,
    };
  } catch (error) {
    console.error('Error reading page:', error);
    return null;
  }
}

export async function updatePage(pageName: string, data: Partial<PageData>): Promise<boolean> {
  try {
    const sanitizedName = sanitizeSlug(pageName);
    const filePath = join(CONTENT_DIR, `${sanitizedName}.md`);

    // Read existing file
    const existing = await getPage(sanitizedName);
    if (!existing) return false;

    // Merge updates
    const updatedFrontmatter = {
      ...(existing.frontmatter || {}),
      ...(data.frontmatter || {}),
    };

    const updatedContent = data.content !== undefined ? data.content : existing.content;

    // Write back
    const fileContent = matter.stringify(updatedContent, updatedFrontmatter);
    await writeFile(filePath, fileContent, 'utf-8');

    return true;
  } catch (error) {
    console.error('Error updating page:', error);
    return false;
  }
}
