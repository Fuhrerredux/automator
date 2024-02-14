<script setup lang="ts">
import { Field, type FieldEntry, useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import useConfiguration from '@/stores/config'
import Dropdown from '@components/dropdown.vue'
import Switch from '@components/switch.vue'
import { MinusIcon, PlusIcon } from '@heroicons/vue/20/solid'
import useTraits from '@stores/traits'
import { toTypedSchema } from '@vee-validate/yup'

const props = defineProps<{
  fields: FieldEntry<Advisor>[]
}>()
const emit = defineEmits<{
  (e: 'push', v: Advisor): void
  (e: 'remove', v: number): void
}>()

const schema = toTypedSchema(
  yup.object().shape({
    slot: yup.string().required('Advisor slot is required'),
    removeable: yup.boolean().required(),
    trait: yup.string().required('Trait is required'),
    cost: yup.number()
  })
)

const { t } = useI18n()
const { traits } = useTraits()
const { config, positionsArray } = useConfiguration()
const { resetForm, handleSubmit } = useForm<Advisor>({
  initialValues: {
    slot: positionsArray.length > 0 ? positionsArray[0].key : '',
    removeable: false,
    trait: '',
    cost: config.character.defaultCost
  },
  validationSchema: schema
})
const { value: characterSlot } = useField<string>('slot')

const options = computed(() => {
  const slots = props.fields.map((e) => e.value.slot)
  return positionsArray.filter((e) => !slots.includes(e.key))
})

const onSubmit = handleSubmit(({ slot, ...rest }: Advisor) => {
  const advisor = { ...rest, slot: String(slot) }
  emit('push', advisor)
  resetForm()
})
</script>

<template>
  <div
    class="border dark:border-zinc-700 rounded-lg p-4 space-y-2"
    v-for="(field, index) in fields">
    <fieldset class="grid grid-cols-2 gap-4">
      <div>
        <label for="slot">
          <span class="form-label">Character Slot</span>
          <input readonly type="text" class="form-input" :value="t(`roles.${field.value.slot}`)" />
        </label>
      </div>
      <div>
        <label for="trait">
          <span class="form-label">{{ t('field.trait') }}</span>
          <input
            readonly
            type="text"
            class="form-input"
            :placeholder="t('placeholder.trait')"
            :value="field.value.trait" />
        </label>
      </div>
      <div>
        <label for="cost">
          <span class="form-label">{{ t('field.cost') }}</span>
          <input
            readonly
            type="number"
            class="form-input"
            :placeholder="t('placeholder.cost')"
            :value="field.value.cost" />
        </label>
      </div>
      <div class="space-y-2">
        <Switch :checked="field.value.hirable" :label="t('field.hirable')" />
        <Switch :checked="field.value.removeable" :label="t('field.removeable')" />
      </div>
    </fieldset>
    <div class="flex items-center justify-end">
      <button type="button" class="button-primary shrink-0" @click="$emit('remove', index)">
        <minus-icon class="h-5 w-5" />
      </button>
    </div>
  </div>

  <form class="border dark:border-zinc-700 rounded-lg p-4 space-y-2" @submit="onSubmit">
    <fieldset class="grid grid-cols-2 gap-4">
      <div>
        <Field name="slot" v-slot="{ value, handleChange }">
          <legend class="form-label">Character Slot</legend>
          <dropdown
            localise
            display-key="name"
            value-key="key"
            :options="options"
            :model-value="value"
            @update:model-value="handleChange" />
        </Field>
      </div>
      <div v-if="Object.keys(traits).includes(characterSlot)">
        <Field name="trait" v-slot="{ value, handleChange }">
          <legend class="form-label">Trait</legend>
          <dropdown
            localise
            :display-key="(e) => String(e)"
            :value-key="(e: string) => e"
            :options="traits[characterSlot as Position]"
            :model-value="value"
            @update:model-value="handleChange" />
        </Field>
      </div>
      <div>
        <Field name="cost" v-slot="{ value, handleChange }">
          <label for="cost">
            <span class="form-label">{{ t('field.cost') }}</span>
            <input
              type="number"
              class="form-input"
              :placeholder="t('placeholder.cost')"
              :value="value"
              @change="handleChange" />
          </label>
        </Field>
      </div>
      <div class="space-y-2">
        <Field
          type="checkbox"
          name="hirable"
          v-slot="{ value, handleChange }"
          :value="true"
          :unchecked-value="false">
          <Switch :checked="value" :label="t('field.hirable')" @update:model-value="handleChange" />
        </Field>
        <Field
          type="checkbox"
          name="removeable"
          v-slot="{ value, handleChange }"
          :value="true"
          :unchecked-value="false">
          <Switch
            :checked="value"
            :label="t('field.removeable')"
            @update:model-value="handleChange" />
        </Field>
      </div>
    </fieldset>
    <div class="flex items-center justify-end">
      <button type="submit" class="button-primary shrink-0">
        <plus-icon class="h-5 w-5" />
      </button>
    </div>
  </form>
</template>