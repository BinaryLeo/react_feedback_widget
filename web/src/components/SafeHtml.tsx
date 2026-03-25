import type { ReactNode } from 'react';

interface SafeHtmlProps {
  content: string;
  allowedTags?: string[];
}

/**
 * Safely render HTML content with link interpolation
 * Replaces dangerous patterns like dangerouslySetInnerHTML
 * 
 * Usage:
 * Translation: "Configure AI in [link]settings[/link]"
 * Renders: "Configure AI in <a href="/settings">settings</a>"
 */
export function SafeHtml({ content }: SafeHtmlProps) {
  // Split by link markers
  const parts: ReactNode[] = [];
  let remaining = content;
  let key = 0;

  while (remaining.includes('[link]') && remaining.includes('[/link]')) {
    const startIdx = remaining.indexOf('[link]');
    const endIdx = remaining.indexOf('[/link]');

    if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) break;

    // Text before link
    if (startIdx > 0) {
      parts.push(<span key={key++}>{remaining.slice(0, startIdx)}</span>);
    }

    // Link content
    const linkText = remaining.slice(startIdx + 6, endIdx);
    parts.push(
      <a 
        key={key++}
        href="/settings" 
        className="text-purple-600 font-semibold hover:underline"
      >
        {linkText}
      </a>
    );

    remaining = remaining.slice(endIdx + 7);
  }

  // Remaining text
  if (remaining) {
    parts.push(<span key={key++}>{remaining}</span>);
  }

  return <>{parts}</>;
}
