import { readFile, writeFile, readdir, unlink, rm } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { existsSync } from 'fs';
import {
  getFileFromGitHub,
  commitFileToGitHub,
  deleteFileFromGitHub,
  listFilesFromGitHub,
} from './github';

const CONTENT_DIR = join(process.cwd(), 'src', 'content');
const ARTICLES_DIR = join(CONTENT_DIR, 'articles');

// Determine if we're in production
const isProduction = import.meta.env.PROD;

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
  if (isProduction) {
    // Use GitHub API in production
    return await listFilesFromGitHub('src/content/articles');
  } else {
    // Use filesystem in development
    const files = await readdir(ARTICLES_DIR);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''));
  }
}

export async function getArticle(slug: string): Promise<ArticleData | null> {
  try {
    const sanitizedSlug = sanitizeSlug(slug);
    let fileContent: string | null;

    if (isProduction) {
      // Use GitHub API in production
      fileContent = await getFileFromGitHub(`src/content/articles/${sanitizedSlug}.md`);
    } else {
      // Use filesystem in development
      const filePath = join(ARTICLES_DIR, `${sanitizedSlug}.md`);
      fileContent = await readFile(filePath, 'utf-8');
    }

    if (!fileContent) return null;

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

export async function createArticle(data: Omit<ArticleData, 'slug'>): Promise<string | null> {
  try {
    // Generate slug from title
    const slug = data.frontmatter.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const sanitizedSlug = sanitizeSlug(slug);
    const githubPath = `src/content/articles/${sanitizedSlug}.md`;

    // Check if file already exists
    const existing = await getArticle(sanitizedSlug);
    if (existing) {
      return null; // File exists, return null to indicate conflict
    }

    // Create file content
    const fileContent = matter.stringify(data.content, data.frontmatter);

    if (isProduction) {
      // Commit to GitHub in production
      const success = await commitFileToGitHub(
        githubPath,
        fileContent,
        `Create article: ${data.frontmatter.title}`
      );
      if (!success) return null;
    } else {
      // Write to filesystem in development
      const filePath = join(ARTICLES_DIR, `${sanitizedSlug}.md`);
      await writeFile(filePath, fileContent, 'utf-8');
    }

    return sanitizedSlug;
  } catch (error) {
    console.error('Error creating article:', error);
    return null;
  }
}

export async function updateArticle(slug: string, data: Partial<ArticleData>): Promise<boolean> {
  try {
    const sanitizedSlug = sanitizeSlug(slug);
    const githubPath = `src/content/articles/${sanitizedSlug}.md`;

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

    if (isProduction) {
      // Commit to GitHub in production
      return await commitFileToGitHub(
        githubPath,
        fileContent,
        `Update article: ${existing.frontmatter.title}`
      );
    } else {
      // Write to filesystem in development
      const filePath = join(ARTICLES_DIR, `${sanitizedSlug}.md`);
      await writeFile(filePath, fileContent, 'utf-8');
      return true;
    }
  } catch (error) {
    console.error('Error updating article:', error);
    return false;
  }
}

export async function deleteArticle(slug: string): Promise<boolean> {
  try {
    const sanitizedSlug = sanitizeSlug(slug);
    const githubPath = `src/content/articles/${sanitizedSlug}.md`;

    if (isProduction) {
      // Delete from GitHub in production
      // Note: Images in Vercel Blob are managed separately
      return await deleteFileFromGitHub(githubPath, `Delete article: ${sanitizedSlug}`);
    } else {
      // Delete from filesystem in development
      const filePath = join(ARTICLES_DIR, `${sanitizedSlug}.md`);
      await unlink(filePath);

      // Delete associated local images
      const imagesDir = join(process.cwd(), 'public', 'images', 'articles', sanitizedSlug);
      if (existsSync(imagesDir)) {
        await rm(imagesDir, { recursive: true, force: true });
      }

      return true;
    }
  } catch (error) {
    console.error('Error deleting article:', error);
    return false;
  }
}

export async function getPage(pageName: string): Promise<PageData | null> {
  try {
    const sanitizedName = sanitizeSlug(pageName);
    let fileContent: string | null;

    if (isProduction) {
      // Use GitHub API in production
      fileContent = await getFileFromGitHub(`src/content/${sanitizedName}.md`);
    } else {
      // Use filesystem in development
      const filePath = join(CONTENT_DIR, `${sanitizedName}.md`);
      fileContent = await readFile(filePath, 'utf-8');
    }

    if (!fileContent) return null;

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
    const githubPath = `src/content/${sanitizedName}.md`;

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

    if (isProduction) {
      // Commit to GitHub in production
      return await commitFileToGitHub(githubPath, fileContent, `Update page: ${sanitizedName}`);
    } else {
      // Write to filesystem in development
      const filePath = join(CONTENT_DIR, `${sanitizedName}.md`);
      await writeFile(filePath, fileContent, 'utf-8');
      return true;
    }
  } catch (error) {
    console.error('Error updating page:', error);
    return false;
  }
}
