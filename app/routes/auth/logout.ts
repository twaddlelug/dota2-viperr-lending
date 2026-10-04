import { redirect } from 'react-router'
import { destroySession, getSession } from '~/features/auth/session.server'
import type { Route } from './+types/logout'

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request)
  return redirect('/', {
    headers: { 'Set-Cookie': await destroySession(session) },
  })
}

export const loader = () => redirect('/')
