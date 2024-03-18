<script setup lang="ts">
import { Field, type FieldEntry, useForm } from 'vee-validate'
import * as yup from 'yup'
import { computed } from 'vue'
import Combobox from '@components/combobox.vue'
import { MinusIcon, PlusIcon } from   '@heroicons/vue/20/solid'
import useConfiguration from '@stores/config'
import { toTypedSchema } from '@vee-validate/yup'

const props = defineProps<{
  fields: FieldEntry<CountryLeaderForm>[]
}>()
const emit = defineEmits<{
  (e: 'push', v: CountryLeaderForm): void
  (e: 'remove', v: number): void
}>()

const schema = toTypedSchema(
  yup.object().shape({
    subideology: yup
      .object()
      .shape({
        key: yup.string().required(),
        name: yup.string().required(),
        short: yup.string()
      })
      .required(),
    trait: yup.string()
  })
)

const { ideologiesArray } = useConfiguration()
const { defineField, resetForm, handleSubmit } = useForm<CountryLeaderForm>({
  initialValues: {
    subideology: ideologiesArray[0],
    trait: ''
  },
  validationSchema: schema
})
const [trait, traitAttr] = defineField('trait')

const options = computed(() => {
  const ideologies = props.fields.map((e) => e.value.subideology.key)
  return ideologiesArray
    .map((e) => ({ value: e.key, label: e.name }))
    .filter((e) => !ideologies.includes(e.value))
})

const onSubmit = handleSubmit((formData: CountryLeaderForm) => {
  emit('push', formData)
  resetForm()
})
</script>

<template>
  <div class="space-y-2">
    <div v-for="(field, index) in fields">
      <div class="flex items-center gap-2" :key="field.key">
        <div class="flex-1">
          <label :for="`subideology-${field.key}`">
            <span class="sr-only">Subideology</span>
            <input
              readonly
              type="text"
              class="form-input"
              :id="`subideology-${field.key}`"
              :value="field.value.subideology.name" />
          </label>
        </div>
        <div class="flex-1">
          <label :for="`trait-${field.key}`">
            <span class="sr-only">Trait</span>
            <input
              readonly
              type="text"
              class="form-input"
              :id="`trait-${field.key}`"
              :value="field.value.trait" />
          </label>
        </div>
        <button type="button" class="button-primary shrink-0" @click="$emit('remove', index)">
          <minus-icon class="w-5 h-5" />
        </button>
      </div>
    </div>
    <form class="flex items-end gap-2" @submit="onSubmit">
      <div class="flex-1">
        <legend class="form-label">Subideology</legend>
        <Field name="subideology" v-slot="{ value, handleChange }">
          <combobox
            value-key="key"
            display-key="name"
            :model-value="value"
            :options="options"
            @update:model-value="handleChange" />
        </Field>
      </div>
      <div class="flex-1">
        <label for="trait">
          <span class="form-label">Trait</span>
          <input type="text" id="trait" class="form-input" v-model="trait" v-bind="traitAttr" />
        </label>
      </div>
      <button type="submit" class="button-primary shrink-0">
        <plus-icon class="w-5 h-5" />
      </button>
    </form>
  </div>
</template>
