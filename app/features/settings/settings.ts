import { SITE } from '~/config/site'

export type SiteSettings = {
  heroText: string
  aboutTitle: string
  aboutText: string
  discordEventUrl: string
}

export const SETTINGS_DEFAULTS: SiteSettings = {
  heroText: SITE.description,
  aboutTitle: 'а нахуя эта залупа типо?',
  aboutText:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  discordEventUrl: 'https://discord.gg/events/SOSIHUILOH_228_67',
}
