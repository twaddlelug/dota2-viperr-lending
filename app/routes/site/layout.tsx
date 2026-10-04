import { Outlet } from 'react-router'
import { Footer } from '~/components/layout/footer'
import { getSettings } from '~/features/settings/settings.server'
import type { Route } from './+types/layout'

export async function loader() {
  const settings = await getSettings()
  return { discordUrl: settings.discordEventUrl }
}

export default function SiteLayout({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Outlet />
      <Footer discordUrl={loaderData.discordUrl} />
    </>
  )
}
