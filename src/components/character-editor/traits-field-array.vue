<script setup lang="ts">
import { type FieldEntry, useForm } from 'vee-validate'
import * as yup from 'yup'
import { MinusIcon, PlusIcon } from '@heroicons/vue/20/solid'
import { toTypedSchema } from '@vee-validate/yup'

defineProps<{
  fields: FieldEntry<string>[]
}>()
const emit = defineEmits<{
  (e: 'push', v: string): void
  (e: 'remove', v: number): void
}>()

const schema = toTypedSchema(
  yup.object().shape({
    value: yup.string()
    // .required('Trait is required') it shouldn't be required
  })
)

const { defineField, resetForm, errors, handleSubmit } = useForm<{ value: string }>({
  initialValues: {
    value: ''
  },
  validationSchema: schema
})
const [value, valueAttr] = defineField('value')

const onSubmit = handleSubmit(({ value }: { value: string }) => {
  emit('push', value)
  resetForm()
})
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center gap-2" v-for="(field, index) in fields">
      <label class="flex-1" :key="field.key">
        <input readonly type="text" class="form-input" :value="field.value" />
      </label>
      <button type="button" class="button-primary shrink-0" @click="$emit('remove', index)">
        <minus-icon class="w-5 h-5" />
      </button>
    </div>
    <form class="flex items-start gap-2" @submit="onSubmit">
      <div class="flex-1">
        <label for="new">
          <!-- required not -->
          <input
            type="text"
            id="new"
            class="form-input"
            v-model="value"
            v-bind="valueAttr" />
        </label>
        <p class="form-helper-error" v-if="errors.value">
          {{ errors.value }}
        </p>
      </div>
      <button type="submit" class="button-primary shrink-0">
        <plus-icon class="w-5 h-5" />
      </button>
    </form>
  </div>
</template>
