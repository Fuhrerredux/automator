<script setup lang="ts">
import { Field, type FieldEntry, useForm } from 'vee-validate'
import * as yup from 'yup'
import Dropdown from '@components/dropdown.vue'
import { MinusIcon, PlusIcon } from '@heroicons/vue/20/solid'
import { commanding } from '@shared/const/roles'
import { toTypedSchema } from '@vee-validate/yup'

defineProps<{
  fields: FieldEntry<Characters.General>[]
}>()

const emit = defineEmits<{
  (e: 'push', v: Characters.General): void
  (e: 'remove', v: number): void
}>()

const schema = toTypedSchema(
  yup.object().shape({
    type: yup.string().required(),
    trait: yup.string()
  })
)

const { defineField, resetForm, handleSubmit } = useForm<Characters.General>({
  initialValues: {
    type: 'general',
    trait: ''
  },
  validationSchema: schema
})
const [trait, traitAttr] = defineField('trait')

const onSubmit = handleSubmit((formData: Characters.General) => {
  emit('push', formData)
  resetForm()
})
</script>

<template>
  <div class="space-y-2">
    <div v-for="(field, index) in fields">
      <div class="flex items-center gap-2" :key="field.key">
        <div class="flex-1">
          <label :for="`type=${field.key}`">
            <span class="sr-only">Commander Type</span>
            <input 
              readonly 
              type="text" 
              class="form-input" 
              :value="field.value.type" 
              :id="`type-${field.key}`"/>
          </label>
        </div>
        <!-- <label class="flex-1" :key="field.key">
        <input readonly type="text" class="form-input" :value="field.value" />
      </label> -->
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
        <legend class="form-label">Type</legend>
        <Field name="type" v-slot="{ value, handleChange }">
          <dropdown
            value-key="key"
            display-key="name"
            :model-value="value"
            :options="commanding"
            @update:model-value="handleChange"
            localise />
        </Field>
        <!-- <label for="new">
          required not
          <input type="text" id="new" class="form-input" v-model="trait" v-bind="traitAttr" />
        </label> -->
        <!-- <p class="form-helper-error" v-if="errors.value">
          {{ errors.value }}
        </p> -->
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
