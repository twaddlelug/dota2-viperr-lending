export const text = (form: FormData, name: string) =>
  String(form.get(name) ?? '').trim()

export const optionalText = (form: FormData, name: string) =>
  text(form, name) || null

export function optionalInt(form: FormData, name: string) {
  const value = text(form, name)
  if (!value) return null
  const number = Number(value)
  return Number.isInteger(number) ? number : null
}
