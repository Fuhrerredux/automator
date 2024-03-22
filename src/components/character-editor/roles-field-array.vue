<script setup lang="ts">
import { Field, type FieldEntry, useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import useConfiguration from '@/stores/config'
import Combobox from '@components/combobox.vue'
import Switch from '@components/switch.vue'
import { MinusIcon, PlusIcon } from '@heroicons/vue/20/solid'
import useTraitsStore from '@stores/traits'
import { toTypedSchema } from '@vee-validate/yup'
import useSettingsStore from '@/stores/settings'


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
    hirable: yup.boolean().required(),
    //.required('Trait is required'),
    trait: yup.string(),
    cost: yup.number()
  })
)

// const {
//   fields: advisorTraitFields,
//   push: advisorTraitPush,
//   remove: advisorTraitRemove
// } = useFieldArray<string>('trait')

const { t } = useI18n()
const { traits } = useTraitsStore()
const { config, positionsArray } = useConfiguration()
const settingsStore = useSettingsStore()
const { defineField, resetForm, setValues, handleSubmit, errors } = useForm<Advisor>({
  initialValues: {
    slot: positionsArray.length > 0 ? positionsArray[0].key : '',
    removeable: false,
    hirable: false,
    trait: '',
    cost: config.character.defaultCost
  },
  validationSchema: schema
})
console.log(errors.value)
const { value: characterSlot } = useField<string>('slot')

const [trait, traitAttr] = defineField('trait')


const slotOptions = computed(() => {
  const slots = props.fields.map((e) => e.value.slot)
  console.log(errors.value)
  return positionsArray
    .map((e) => ({ value: e.key, label: e.name }))
    .filter((e) => !slots.includes(e.value))
})
const traitOptions = computed(() => {
  console.log(errors.value)
  return traits[characterSlot.value as Position].map((e) => ({ label: e, value: e }))
})

watch(characterSlot, () => {
  const key = characterSlot.value
  const slot = positionsArray.find((e) => e.key === key)
  setValues({ hirable: slot?.hirable, removeable: slot?.removable })
  console.log(errors.value)
})


const onSubmit = handleSubmit(({ slot, ...rest }: Advisor & { trait?: string }) => {
  console.log(errors.value)
  const advisor = { ...rest, slot: String(slot), trait: rest.trait }
  emit('push', advisor)
  resetForm()
  if (settingsStore.getPreference('useInputForAdvisorTraitBox')) {
    setValues({ trait: '' })
  }
})

</script>

<template>
  <div
    class="p-4 space-y-2 border rounded-lg dark:border-zinc-700"
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
        <minus-icon class="w-5 h-5" />
      </button>
    </div>
  </div>

  <form class="p-4 space-y-2 border rounded-lg dark:border-zinc-700" @submit="onSubmit">
    <fieldset class="grid grid-cols-2 gap-4">
      <div>
        <Field name="slot" v-slot="{ value, handleChange }">
          <legend class="form-label">Character Slot</legend>
          <combobox
            localise
            :options="slotOptions"
            :model-value="value"
            @update:model-value="handleChange" />
        </Field>
      </div>
      <div v-if="Object.keys(traits).includes(characterSlot) && !settingsStore.getPreference('useInputForAdvisorTraitBox')">
        <Field name="trait" v-slot="{ value, handleChange }">
          <legend class="form-label">Trait</legend>
          <combobox v-if="!settingsStore.getPreference('useInputForAdvisorTraitBox')"
            localise
            :options="traitOptions"
            :model-value="value"
            @update:model-value="handleChange" />
        </Field>
      </div>
      <div v-if="settingsStore.getPreference('useInputForAdvisorTraitBox')"></div>
        <label for="traitInput">
          <span class="form-label">Trait</span>
          <input v-if="settingsStore.getPreference('useInputForAdvisorTraitBox')"
            type="text"
            id="traitInput"
            class="form-input"
            v-model="trait"
            v-bind="traitAttr"
          />
        </label>
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
        <plus-icon class="w-5 h-5" />
      </button>
    </div>
  </form>
</template>
