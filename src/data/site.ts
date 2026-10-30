export type SectionId = 'hero' | 'philosophy' | 'projects' | 'featured' | 'about' | 'expertise' | 'stats' | 'contact'

export interface NavItem {
  id: SectionId
  href: string
  label: 'projects' | 'studio' | 'expertise' | 'contact'
}

export const navItems: readonly NavItem[] = [
  { id: 'projects', href: '#projects', label: 'projects' },
  { id: 'about', href: '#about', label: 'studio' },
  { id: 'expertise', href: '#expertise', label: 'expertise' },
  { id: 'contact', href: '#contact', label: 'contact' },
]

export const studioEmail = 'studio@aureon.archi'
export const studioPhone = '+98 21 8800 4420'
export const studioPhoneHref = 'tel:+982188004420'

export interface SocialLink {
  id: 'instagram' | 'behance' | 'linkedin' | 'pinterest'
  href: string
}

/** Fictional brand — profiles point at the platforms until real accounts exist. */
export const socialLinks: readonly SocialLink[] = [
  { id: 'instagram', href: 'https://www.instagram.com/' },
  { id: 'behance', href: 'https://www.behance.net/' },
  { id: 'linkedin', href: 'https://www.linkedin.com/' },
  { id: 'pinterest', href: 'https://www.pinterest.com/' },
]