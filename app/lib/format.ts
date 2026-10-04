import { TOURNAMENT } from '~/config/site'

const matchTime = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: TOURNAMENT.timeZone,
})

export const formatMatchTime = (iso: string) =>
  `${matchTime.format(new Date(iso))} ${TOURNAMENT.timeZoneLabel}`

export function toTournamentLocalInput(iso: string | undefined) {
  if (!iso) return ''
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: TOURNAMENT.timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(new Date(iso))
      .map(part => [part.type, part.value])
  )
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`
}

export const fromTournamentLocalInput = (value: string) =>
  value ? new Date(`${value}:00${TOURNAMENT.timeZoneOffset}`) : null

const matchTimeShort = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: TOURNAMENT.timeZone,
})

export const formatMatchTimeShort = (iso: string) =>
  matchTimeShort.format(new Date(iso))
