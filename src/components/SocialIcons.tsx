/**
 * Social media glyphs. lucide-react removed its brand icons, so these four
 * are drawn inline — no extra dependency, and they inherit currentColor like
 * every other icon on the site.
 */

interface IconProps {
  size?: number;
}

export function LinkedInIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1-.02 5 2.5 2.5 0 0 1 .02-5ZM3 9.4h4V21H3zM9.5 9.4h3.8v1.6h.06c.53-1 1.82-2.06 3.75-2.06 4 0 4.74 2.64 4.74 6.07V21h-4v-5.3c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21h-4z" />
    </svg>
  );
}

export function YouTubeIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22.54 7.1a2.78 2.78 0 0 0-1.95-1.97C18.88 4.67 12 4.67 12 4.67s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 7.1 29.3 29.3 0 0 0 1 12.46c0 1.8.15 3.6.46 5.37a2.78 2.78 0 0 0 1.95 1.96c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96c.31-1.77.46-3.56.46-5.37 0-1.8-.15-3.59-.46-5.36ZM9.75 15.77V9.15l5.75 3.31-5.75 3.31Z" />
    </svg>
  );
}

export function XIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.9 3H21l-6.74 7.7L22.2 21h-6.21l-4.87-6.37L5.55 21H2.44l7.21-8.24L2 3h6.37l4.4 5.82L17.9 3Zm-1.09 16.14h1.72L7.44 4.76H5.59l11.22 14.38Z" />
    </svg>
  );
}

export function InstagramIcon({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
