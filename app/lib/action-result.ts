type Failure = { ok: false; error: string }

export type ActionResult<Data extends object = object> =
  | ({ ok: true } & Data)
  | Failure

export function ok(): ActionResult
export function ok<Data extends object>(data: Data): ActionResult<Data>
export function ok(data: object = {}) {
  return { ok: true, ...data }
}

export const fail = (error: string): Failure => ({ ok: false, error })

export const isActionResult = (value: unknown): value is ActionResult =>
  typeof value === 'object' && value !== null && 'ok' in value
