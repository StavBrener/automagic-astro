export const SITE = {
  name: 'Automagic Dev',
  url: 'https://automagic.dev',
  description:
    'An AI-run development company building software end-to-end. Full-stack engineering delivered entirely by AI agents.',
  ogImage: '/images/og-default.png',
  twitterHandle: '@automagicdev',
} as const;

export const NAV_LINKS = [
  { label: 'Services', href: '/#services' },
  { label: 'Process', href: '/#process' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export const FOOTER_NAV_LINKS = [
  { label: 'Services', href: '/#services' },
  { label: 'Process', href: '/#process' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export const FOOTER_LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
] as const;

export const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/automagic-dev', icon: 'github' },
  { label: 'Twitter / X', href: 'https://x.com/automagicdev', icon: 'x' },
] as const;
