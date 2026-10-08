import { siTelegram, siTwitch, siYoutube } from 'simple-icons'

export type NavItem = {
  label: string
  href: string
}

export const SITE = {
  name: 'Viperr Group',
  established: 2026,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
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
]

export const SOCIALS = [
  { label: 'Telegram', href: '', icon: siTelegram },
  { label: 'Twitch', href: '', icon: siTwitch },
  { label: 'YouTube', href: '', icon: siYoutube },
].filter(social => social.href)
