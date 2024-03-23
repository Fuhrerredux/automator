<script setup lang="ts">
import { nanoid } from 'nanoid'
import { Field, useField, useFieldArray, useForm } from 'vee-validate'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import IdeologyFieldArray from '@components/character-editor/ideologies-field-array.vue'
import RolesFieldArray from '@components/character-editor/roles-field-array.vue'
import TraitsFieldArray from '@components/character-editor/traits-field-array.vue'
import Dropdown from '@components/dropdown.vue'
import FormGroup from '@components/form-group.vue'
import AppHeader from '@components/header.vue'
import SpinnerButton from '@components/spinner-button.vue'
import Switch from '@components/switch.vue'
import { CheckIcon } from '@heroicons/vue/20/solid'
import { commanding } from '@shared/const/roles'
import { fromFormData, toFormData } from '@shared/utils/character'
import useCharacterStore from '@stores/characters'
import useConfiguration from '@stores/config'

const { t } = useI18n()
const $toast = useToast()
const router = useRouter()
const { query } = useRoute()
const { config, ideologiesArray } = useConfiguration()
const { create, update, findOne } = useCharacterStore()
const { characterId } = query
const { defineField, resetForm, handleSubmit } = useForm<CharacterForm>({
  initialValues: {
    name: '',
    tag: '',
    leaderRoles: [],
    commanderTraits: [],
    advisorRoles: [],
    commanderRole: null
  }
})

const [name, nameAttrs] = defineField('name')
const [tag, tagAttrs] = defineField('tag')

const { value: enableLeaderRole } = useField<boolean>('addLeaderRole')
const { value: enableCommanderRole } = useField<boolean>('addCommanderRole')
const { value: enableAdvisorRole } = useField<boolean>('addAdvisorRole')

const {
  fields: leaderRolesFields,
  push: leaderRolesPush,
  remove: leaderRolesRemove
} = useFieldArray<CountryLeaderForm>('leaderRoles')
const {
  fields: commanderTraitsFields,
  push: commanderTraitsPush,
  remove: commanderTraitsRemove
} = useFieldArray<string>('commanderTraits')
const {
  fields: advisorRolesFields,
  push: advisorRolesPush,
  remove: advisorRolesRemove
} = useFieldArray<Advisor>('advisorRoles')

const onTagInput = (event: InputEvent) => {
  const inputValue = (event.target as HTMLInputElement).value
    .replace(/[^A-Za-z]/g, '')
    .toUpperCase()
  tag.value = inputValue
}

const onSubmit = handleSubmit(async (data: CharacterForm) => {
  const id = typeof characterId === 'string' ? characterId : nanoid()

  const character: CharacterWithId = {
    id,
    ...fromFormData(data)
  }
  if (data.commanderRole) character.roles = character.roles.concat([data.commanderRole])

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
    const formData = toFormData(characterRaw, config)
    resetForm({
      values: {
        ...formData,
        ideology:
          formData.ideology && typeof formData.ideology === 'object'
            ? formData.ideology.key
            : formData.ideology
      }
    })
  }
})

const ideologiesOptions = computed(() =>
  ideologiesArray.map((e) => ({ value: e.key, label: e.name }))
)
</script>

<template>
  <form @submit="onSubmit">
    <app-header
      :title="t(characterId ? 'modal.character-editor.update' : 'modal.character-editor.create')">
      <spinner-button type="submit" class="flex items-center button-primary" :loading="false">
        <template #content>
          <check-icon class="w-5 h-5 mr-2" />
          <span>{{ t('action.save') }}</span>
        </template>
        <template #loading>
          <check-icon class="w-5 h-5 mr-2" />
          <span>{{ t('loading.saving') }}</span>
        </template>
      </spinner-button>
    </app-header>
    <main class="px-8 space-y-2 content page">
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
              maxlength="3"
              @input="onTagInput"
              :label="t('field.tag')"
              :placeholder="t('placeholder.tag')" />
          </label>
        </div>
        <div>
          <legend class="form-label">{{ t('field.ideology') }}</legend>
          <Field name="ideology" v-slot="{ value, handleChange }">
            <dropdown
              value-key="key"
              display-key="name"
              :model-value="value"
              :options="ideologiesOptions"
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
        <div v-if="enableLeaderRole">
          <ideology-field-array
            :fields="leaderRolesFields"
            @push="leaderRolesPush"
            @remove="leaderRolesRemove" />
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
        <div class="grid items-start grid-cols-2 gap-4" v-if="enableCommanderRole">
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
              <traits-field-array
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
