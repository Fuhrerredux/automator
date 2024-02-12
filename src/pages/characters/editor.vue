<script setup lang="ts">
import { nanoid } from 'nanoid'
import { Field, useField, useFieldArray, useForm } from 'vee-validate'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import IdeologyDropdown from '@/components/ideology-dropdown.vue'
import { commanding } from '@/shared/const/roles'
import { fromFormData, toFormData } from '@/shared/utils/character'
import useCharacterStore from '@/stores/characters'
import useConfiguration from '@/stores/config'
import Dropdown from '@components/dropdown.vue'
import FieldArray from '@components/field-array.vue'
import FormGroup from '@components/form-group.vue'
import AppHeader from '@components/header.vue'
import RolesFieldArray from '@components/roles-field-array.vue'
import SpinnerButton from '@components/spinner-button.vue'
import Switch from '@components/switch.vue'
import { CheckIcon } from '@heroicons/vue/20/solid'

const { t } = useI18n()
const $toast = useToast()
const router = useRouter()
const { query } = useRoute()
const { config } = useConfiguration()
const { create, update, findOne } = useCharacterStore()
const { characterId } = query
const { defineField, resetForm, handleSubmit } = useForm<CharacterForm>({
  initialValues: {
    name: '',
    tag: '',
    leaderTraits: [],
    commanderTraits: [],
    advisorRoles: []
  }
})

const [name, nameAttrs] = defineField('name')
const [tag, tagAttrs] = defineField('tag')

const { value: enableLeaderRole } = useField<boolean>('addLeaderRole')
const { value: enableCommanderRole } = useField<boolean>('addCommanderRole')
const { value: enableAdvisorRole } = useField<boolean>('addAdvisorRole')

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
const {
  fields: advisorRolesFields,
  push: advisorRolesPush,
  remove: advisorRolesRemove
} = useFieldArray<Advisor>('advisorRoles')

const onSubmit = handleSubmit(async (data: CharacterForm) => {
  const id = typeof characterId === 'string' ? characterId : nanoid()

  const character: CharacterWithId = {
    id,
    ...fromFormData(data)
  }
  if (typeof characterId === 'string') {
    const status = await update(character)
    $toast.success(t(status.message))
    router.back()
  } else {
    const status = await create(character)
    $toast.success(t(status.message))
    router.back()
  }
})

onMounted(async () => {
  if (characterId && typeof characterId === 'string') {
    const characterRaw = await findOne(characterId)
    resetForm({
      values: toFormData(characterRaw, config)
    })
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
        <Field
          type="checkbox"
          name="addLeaderRole"
          v-slot="{ value, handleChange }"
          :value="true"
          :unchecked-value="false">
          <Switch
            :label="t('field.leader-role')"
            :checked="value"
            @update:modelValue="handleChange" />
        </Field>
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
        <Field
          type="checkbox"
          name="addCommanderRole"
          v-slot="{ value, handleChange }"
          :value="true"
          :unchecked-value="false">
          <Switch
            :label="t('field.commanding-role')"
            :checked="value"
            @update:modelValue="handleChange" />
        </Field>
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
        <Field
          type="checkbox"
          name="addAdvisorRole"
          v-slot="{ value, handleChange }"
          :value="true"
          :unchecked-value="false">
          <Switch
            :label="t('field.advisor-role')"
            :checked="value"
            @update:modelValue="handleChange" />
        </Field>
        <roles-field-array
          v-if="enableAdvisorRole"
          :fields="advisorRolesFields"
          @push="advisorRolesPush"
          @remove="advisorRolesRemove" />
      </div>
    </main>
  </form>
</template>
