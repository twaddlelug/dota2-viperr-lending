import { Outlet } from 'react-router'
import { Footer } from '~/components/layout/footer'

export default function SiteLayout() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  )
}
