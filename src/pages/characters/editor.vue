<script setup lang="ts">
import { nanoid } from 'nanoid'
import { Field, useField, useFieldArray, useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import IdeologyDropdown from '@/components/ideology-dropdown.vue'
import { commanding, ministers, officers } from '@/shared/const/roles'
import { fromFormData } from '@/shared/utils/character'
import useCharacterStore from '@/stores/characters'
import Dropdown from '@components/dropdown.vue'
import FieldArray from '@components/field-array.vue'
import FormGroup from '@components/form-group.vue'
import AppHeader from '@components/header.vue'
import SpinnerButton from '@components/spinner-button.vue'
import SwitchForm from '@components/switch-form.vue'
import { CheckIcon } from '@heroicons/vue/20/solid'
import useTraits from '@stores/traits'

const { t } = useI18n()
const { traits } = useTraits()
const $toast = useToast()
const { query } = useRoute()
const { create, update } = useCharacterStore()
const { characterId } = query
const { defineField, handleSubmit } = useForm<CharacterForm>({
  initialValues: {
    name: '',
    tag: ''
  }
})
const [name, nameAttrs] = defineField('name')
const [tag, tagAttrs] = defineField('tag')

const { value: enableLeaderRole } = useField<boolean>('addLeaderRole')
const { value: enableCommanderRole } = useField<boolean>('addCommanderRole')
const { value: enableMinisterRole } = useField<boolean>('addMinisterRole')
const { value: enableOfficerRole } = useField<boolean>('addOfficerRole')
const { value: ministerRoles } = useField<Record<MinisterPosition, boolean>>(
  'ministerRoles',
  undefined,
  {
    initialValue: {
      head_of_government: false,
      foreign_minister: false,
      economy_minister: false,
      security_minister: false
    }
  }
)
const { value: officerRoles } = useField<Record<MilitaryPosition, boolean>>(
  'officerRoles',
  undefined,
  {
    initialValue: {
      high_command: false,
      army_chief: false,
      navy_chief: false,
      air_chief: false,
      theorist: false
    }
  }
)

const {
  fields: leaderTraitsFields,
  push: leaderTraitsPush,
  remove: leaderTraitsRemove
} = useFieldArray<string>('leaderTraits')
const {
  fields: commanderTraitsFields,
  push: commanderTraitsPush,
  remove: commanderTraitsRemove
} = useFieldArray<string>('command')

const onSubmit = handleSubmit(async (data: CharacterForm) => {
  const id = typeof characterId === 'string' ? characterId : nanoid()
  const character: CharacterWithId = {
    id,
    ...fromFormData(data)
  }
  if (typeof characterId === 'string') {
    const status = await update(character)
    $toast.success(t(status.message))
  } else {
    const status = await create(character)
    $toast.success(t(status.message))
  }
})
</script>

<template>
  <form @submit="onSubmit">
    <app-header
      :title="t(characterId ? 'modal.character-editor.update' : 'modal.character-editor.create')">
      <spinner-button type="submit" class="button-primary flex items-center" :loading="false">
        <template #content>
          <check-icon class="h-5 w-5 mr-2" />
          <span>{{ t('action.save') }}</span>
        </template>
        <template #loading>
          <check-icon class="h-5 w-5 mr-2" />
          <span>{{ t('loading.saving') }}</span>
        </template>
      </spinner-button>
    </app-header>
    <main class="content px-8 page space-y-2">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="name">
            <form-group
              required
              type="text"
              id="name"
              v-model="name"
              v-bind="nameAttrs"
              :label="t('field.name')"
              :placeholder="t('placeholder.name')" />
          </label>
        </div>
        <div>
          <label for="tag">
            <form-group
              required
              type="text"
              id="tag"
              v-model="tag"
              v-bind="tagAttrs"
              :label="t('field.tag')"
              :placeholder="t('placeholder.tag')" />
          </label>
        </div>
        <div>
          <legend class="form-label">{{ t('field.ideology') }}</legend>
          <Field name="ideology" v-slot="{ value, handleChange }">
            <ideology-dropdown
              :multiple="false"
              :model-value="value"
              @update:model-value="handleChange" />
          </Field>
        </div>
      </div>
      <div class="space-y-2">
        <switch-form name="addLeaderRole" value="leaderRole" :label="t('field.leader-role')" />
        <div class="grid grid-cols-2 items-start gap-4" v-if="enableLeaderRole">
          <div>
            <legend class="form-label">{{ t('field.ideology') }}</legend>
            <Field name="ideology" v-slot="{ value, handleChange }">
              <ideology-dropdown multiple :model-value="value" @update:model-value="handleChange" />
            </Field>
          </div>
          <div>
            <legend class="form-label">{{ t('field.traits') }}</legend>
            <field-array
              :fields="leaderTraitsFields"
              @push="leaderTraitsPush"
              @remove="leaderTraitsRemove" />
          </div>
        </div>
      </div>
      <div class="space-y-2">
        <switch-form
          name="addCommanderRole"
          value="commanderRole"
          :label="t('field.commanding-role')" />
        <div class="grid grid-cols-2 items-start gap-4" v-if="enableCommanderRole">
          <div>
            <legend class="form-label">{{ t('field.role') }}</legend>
            <Field name="commanderRole" v-slot="{ value, handleChange }">
              <dropdown
                localise
                value-key="value"
                display-key="label"
                :model-value="value"
                :options="commanding"
                @update:model-value="handleChange" />
            </Field>
          </div>
          <div>
            <label for="traits">
              <span class="form-label">{{ t('field.traits') }}</span>
              <field-array
                :fields="commanderTraitsFields"
                @push="commanderTraitsPush"
                @remove="commanderTraitsRemove" />
            </label>
          </div>
        </div>
      </div>
      <div class="space-y-2">
        <switch-form
          name="addMinisterRole"
          value="ministerRole"
          :label="t('field.minister-role')" />
        <div class="grid grid-cols-2 items-start gap-4" v-if="enableMinisterRole">
          <div v-for="position of ministers">
            <div class="flex items-center">
              <Field
                type="checkbox"
                v-slot="{ value, handleChange, handleInput, handleBlur }"
                :name="`ministerRoles.${position.value}`"
                :value="true"
                :unchecked-value="false">
                <input
                  type="checkbox"
                  class="form-checkbox"
                  :id="position.value"
                  :value="value"
                  @change="handleChange"
                  @input="handleInput"
                  @blur="handleBlur" />
                <legend class="ml-2 text-sm font-medium">{{ t(position.label) }}</legend>
              </Field>
            </div>
            <div v-if="ministerRoles[position.value]" class="mt-2">
              <Field v-slot="{ value, handleChange }" :name="`ministerTraits.${position.value}`">
                <dropdown
                  v-if="traits[position.value].length > 0"
                  :options="traits[position.value]"
                  :display-key="(e) => String(e)"
                  :value-key="(e: string) => e"
                  :model-value="value"
                  @update:model-value="handleChange" />
                <form-group
                  v-if="traits[position.value].length <= 0"
                  type="text"
                  :model-value="value"
                  :id="`${position}-trait`"
                  :label="t('field.traits')"
                  @update:model-value="handleChange" />
              </Field>
            </div>
          </div>
        </div>
      </div>
      <div class="space-y-2">
        <switch-form name="addOfficerRole" value="officerRole" :label="t('field.officer-role')" />
        <div class="grid grid-cols-2 items-start gap-4" v-if="enableOfficerRole">
          <div v-for="position of officers">
            <div class="flex items-center">
              <Field
                type="checkbox"
                v-slot="{ value, handleChange, handleInput, handleBlur }"
                :name="`officerRoles.${position.value}`"
                :value="true"
                :unchecked-value="false">
                <input
                  type="checkbox"
                  class="form-checkbox"
                  :id="position.value"
                  :value="value"
                  @change="handleChange"
                  @input="handleInput"
                  @blur="handleBlur" />
                <legend class="ml-2 text-sm font-medium">{{ t(position.label) }}</legend>
              </Field>
            </div>
            <div v-if="officerRoles[position.value]" class="mt-2">
              <Field v-slot="{ value, handleChange }" :name="`officerTraits.${position.value}`">
                <dropdown
                  v-if="traits[position.value].length > 0"
                  :options="traits[position.value]"
                  :display-key="(e) => String(e)"
                  :value-key="(e: string) => e"
                  :model-value="value"
                  @update:model-value="handleChange" />
                <form-group
                  v-if="traits[position.value].length <= 0"
                  type="text"
                  :model-value="value"
                  :id="`${position}-trait`"
                  :label="t('field.traits')"
                  @update:model-value="handleChange" />
              </Field>
            </div>
          </div>
        </div>
      </div>
    </main>
  </form>
</template>
