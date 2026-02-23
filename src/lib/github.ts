import { Octokit } from '@octokit/rest';

interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

function getConfig(): GitHubConfig {
  const owner = import.meta.env.GITHUB_OWNER;
  const repo = import.meta.env.GITHUB_REPO;
  const branch = import.meta.env.GITHUB_BRANCH || 'main';
  const token = import.meta.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    throw new Error('GitHub configuration missing. Set GITHUB_OWNER, GITHUB_REPO, and GITHUB_TOKEN in .env');
  }

  return { owner, repo, branch, token };
}

/**
 * Get file content from GitHub
 */
export async function getFileFromGitHub(path: string): Promise<string | null> {
  try {
    const config = getConfig();
    const octokit = new Octokit({ auth: config.token });

    const { data } = await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path,
      ref: config.branch,
    });

    if ('content' in data) {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }

    return null;
  } catch (error) {
    console.error('Error getting file from GitHub:', error);
    return null;
  }
}

/**
 * Commit file changes to GitHub
 */
export async function commitFileToGitHub(
  path: string,
  content: string,
  message: string
): Promise<boolean> {
  try {
    const config = getConfig();
    const octokit = new Octokit({ auth: config.token });

    // Get current file to retrieve its SHA (required for updates)
    let sha: string | undefined;
    try {
      const { data } = await octokit.repos.getContent({
        owner: config.owner,
        repo: config.repo,
        path,
        ref: config.branch,
      });

      if ('sha' in data) {
        sha = data.sha;
      }
    } catch (error) {
      // File doesn't exist yet, that's okay for new files
    }

    // Create or update the file
    await octokit.repos.createOrUpdateFileContents({
      owner: config.owner,
      repo: config.repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      branch: config.branch,
      sha,
    });

    return true;
  } catch (error) {
    console.error('Error committing to GitHub:', error);
    return false;
  }
}

/**
 * Delete file from GitHub
 */
export async function deleteFileFromGitHub(path: string, message: string): Promise<boolean> {
  try {
    const config = getConfig();
    const octokit = new Octokit({ auth: config.token });

    // Get file SHA (required for deletion)
    const { data } = await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path,
      ref: config.branch,
    });

    if (!('sha' in data)) {
      return false;
    }

    // Delete the file
    await octokit.repos.deleteFile({
      owner: config.owner,
      repo: config.repo,
      path,
      message,
      sha: data.sha,
      branch: config.branch,
    });

    return true;
  } catch (error) {
    console.error('Error deleting file from GitHub:', error);
    return false;
  }
}

/**
 * List files in a directory from GitHub
 */
export async function listFilesFromGitHub(path: string): Promise<string[]> {
  try {
    const config = getConfig();
    const octokit = new Octokit({ auth: config.token });

    const { data } = await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path,
      ref: config.branch,
    });

    if (Array.isArray(data)) {
      return data
        .filter(item => item.type === 'file' && item.name.endsWith('.md'))
        .map(item => item.name.replace('.md', ''));
    }

    return [];
  } catch (error) {
    console.error('Error listing files from GitHub:', error);
    return [];
  }
}
