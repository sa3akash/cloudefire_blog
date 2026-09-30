export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function calculateReadingTime(content: string): number {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  const time = Math.ceil(words / 200);
  return Math.max(1, time);
}

export function slugifyText(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>?/gm, "")
    .replace(/[#*`_~]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractHeadings(markdown: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const lines = markdown.split("\n");

  for (const line of lines) {
    const match = line.match(/^(#{2,4})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const rawText = match[2].trim();
      const text = rawText.replace(/[#*`_~]/g, "").trim();
      const id = slugifyText(text);

      if (id) {
        headings.push({ id, text, level });
      }
    }
  }

  return headings;
}
