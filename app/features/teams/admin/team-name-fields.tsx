import { Field, Input } from '~/components/admin/form-controls'
import { NAME_MAX_LENGTH, TAG_MAX_LENGTH } from '../team'

export function TeamNameFields({
  team,
}: {
  team?: { name: string; tag: string }
}) {
  return (
    <div className="grid grid-cols-[1fr_7rem] gap-4">
      <Field label="Название">
        <Input
          name="name"
          defaultValue={team?.name}
          maxLength={NAME_MAX_LENGTH}
          required
          autoFocus
        />
      </Field>
      <Field label="Тег">
        <Input
          name="tag"
          defaultValue={team?.tag}
          maxLength={TAG_MAX_LENGTH}
          required
          className="uppercase"
        />
      </Field>
    </div>
  )
}
