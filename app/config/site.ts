import { siTelegram, siTwitch, siYoutube } from 'simple-icons'

export type NavItem = {
  label: string
  href: string
}

export const SITE = {
  name: 'Viperr Group',
  established: 2026,
  description: 'Вау!',
} as const

export const TOURNAMENT = {
  timeZone: 'Europe/Moscow',
  timeZoneOffset: '+03:00',
  timeZoneLabel: 'МСК',
} as const

export const NAV_LINKS: NavItem[] = [
  { label: 'Главная', href: '/' },
  { label: 'Сетка', href: '/bracket' },
  { label: 'Команды', href: '/teams' },
  { label: 'Партнеры', href: '/partners' },
]

export const SOCIALS = [
  { label: 'Telegram', href: '', icon: siTelegram },
  { label: 'Twitch', href: '', icon: siTwitch },
  { label: 'YouTube', href: '', icon: siYoutube },
].filter(social => social.href)
