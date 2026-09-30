export interface ExportablePost {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  status?: string;
  publishedAt?: Date | null;
  category?: string | null;
  tags?: string[];
}

export function exportPostAsMarkdown(post: ExportablePost): string {
  const frontmatter = [
    "---",
    `title: "${post.title.replace(/"/g, '\\"')}"`,
    `slug: "${post.slug}"`,
    post.excerpt ? `excerpt: "${post.excerpt.replace(/"/g, '\\"')}"` : null,
    post.category ? `category: "${post.category}"` : null,
    post.tags && post.tags.length ? `tags: [${post.tags.map((t) => `"${t}"`).join(", ")}]` : null,
    post.publishedAt ? `date: "${new Date(post.publishedAt).toISOString()}"` : null,
    "---",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  return `${frontmatter}${post.content}`;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseImportedMarkdown(raw: string): {
  title?: string;
  excerpt?: string;
  content: string;
} {
  const frontmatterMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    return { content: raw.trim() };
  }

  const frontmatterRaw = frontmatterMatch[1];
  const body = frontmatterMatch[2].trim();

  let title: string | undefined;
  let excerpt: string | undefined;

  const titleMatch = frontmatterRaw.match(/title:\s*["']?([^"'\n\r]+)["']?/i);
  if (titleMatch) title = titleMatch[1].trim();

  const excerptMatch = frontmatterRaw.match(/excerpt:\s*["']?([^"'\n\r]+)["']?/i);
  if (excerptMatch) excerpt = excerptMatch[1].trim();

  return { title, excerpt, content: body };
}
