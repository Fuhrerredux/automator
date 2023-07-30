<script setup lang="ts">
import { nanoid } from 'nanoid'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CharacterRepository from '@/database/repository'
import Dropdown from '@components/dropdown.vue'
import FormGroup from '@components/form-group.vue'
import Modal from '@components/modal.vue'
import SpinnerButton from '@components/spinner-button.vue'
import SwitchButton from '@components/switch.vue'
import { CheckIcon } from '@heroicons/vue/20/solid'
import { ideologies } from '@shared/const/ideology'
import { commanding, ministers, officers } from '@shared/const/roles'

const repository = CharacterRepository.getInstance()
const { t } = useI18n()
const loading = ref(false)
defineProps({
  open: Boolean
})

const tag = ref('')
const name = ref('')
const ideology = ref<Ideology>(ideologies[0].value)
const addLeaderRole = ref(false)
const addCommandingRole = ref(false)
const addMinisterRole = ref(false)
const addOfficerRole = ref(false)

const leaderTraits = ref('')

const commandingRole = ref<CommandingRole>(commanding[0].value)
const commanderTraits = ref('')
const ministerRoles = ref<MinisterPosition[]>([])
const ministerTraits = ref<Record<MinisterPosition, string>>({
  'head-of-government': '',
  'foreign-minister': '',
  'economy-minister': '',
  'security-minister': ''
})
const officerRoles = ref<MilitaryPosition[]>([])
const officerTraits = ref<Record<MilitaryPosition, string>>({
  'high-command': '',
  'army-chief': '',
  'air-chief': '',
  'navy-chief': ''
})

function handleMinisterRoles(event: Event) {
  const target = event.target as HTMLInputElement
  const role = target.dataset['role'] as MinisterPosition
  const roles = Array.from(ministerRoles.value)
  if (!roles.includes(role)) {
    roles.push(role)
    ministerRoles.value = roles
  } else ministerRoles.value = roles.filter((e) => e !== role)
}
function handleOfficerRoles(event: Event) {
  const target = event.target as HTMLInputElement
  const role = target.dataset['role'] as MilitaryPosition
  const roles = Array.from(officerRoles.value)
  if (!roles.includes(role)) {
    roles.push(role)
    officerRoles.value = roles
  } else officerRoles.value = roles.filter((e) => e !== role)
}
async function submit() {
  try {
    loading.value = true
    const roles: CharacterRole[] = []

    if (addLeaderRole.value) roles.push('leader')
    if (addCommandingRole.value) roles.push(commandingRole.value)
    if (addMinisterRole.value) roles.push('minister')

    const character: CharacterWithId = {
      id: nanoid(),
      name: name.value,
      tag: tag.value,
      cost: 150,
      ideology: ideology.value,
      commanderTraits: commanderTraits.value.split(','),
      leaderTraits: leaderTraits.value.split(','),
      ministerTraits: ministerTraits.value,
      positions: ministerRoles.value,
      roles
    }
    repository.create(character)
  } catch {
    /* empty */
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <modal :hideable="!loading" :open="open" size="max-w-2xl" @hide="$emit('hide')">
    <template #title>{{ t('create.heading') }}</template>
    <template #body>
      <form @submit.prevent="submit">
        <div class="space-y-2">
          <div>
            <label for="name">
              <form-group
                required
                type="text"
                id="name"
                v-model.trim="name"
                :label="t('field.name')"
                :placeholder="t('placeholder.name')" />
            </label>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-full">
              <label for="tag">
                <form-group
                  required
                  type="text"
                  id="tag"
                  v-model.trim="tag"
                  :label="t('field.tag')"
                  :placeholder="t('placeholder.tag')" />
              </label>
            </div>
            <div class="w-full">
              <label for="ideology">
                <span class="form-label">{{ t('field.ideology') }}</span>
                <dropdown
                  localise
                  :model-value="ideology"
                  :options="ideologies"
                  value-key="value"
                  display-key="label"
                  @update:model-value="ideology = $event" />
              </label>
            </div>
          </div>
          <div>
            <switch-button
              :checked="addLeaderRole"
              :label="t('field.leader-role')"
              @update:model-value="addLeaderRole = $event" />
            <div v-if="addLeaderRole">
              <label for="traits">
                <form-group
                  type="text"
                  id="traits"
                  v-model.trim="leaderTraits"
                  :label="t('field.traits')"
                  :placeholder="t('placeholder.traits')" />
              </label>
            </div>
          </div>
          <div class="space-y-2">
            <switch-button
              :checked="addCommandingRole"
              :label="t('field.commanding-role')"
              @update:model-value="addCommandingRole = $event" />
            <div v-if="addCommandingRole" class="flex items-center gap-4">
              <div class="w-full">
                <label for="ideology">
                  <span class="form-label">{{ t('field.role') }}</span>
                  <dropdown
                    localise
                    value-key="value"
                    display-key="label"
                    :model-value="commandingRole"
                    :options="commanding"
                    @update:model-value="commandingRole = $event" />
                </label>
              </div>
              <div class="w-full">
                <label for="traits">
                  <form-group
                    type="text"
                    id="traits"
                    v-model.trim="commanderTraits"
                    :label="t('field.traits')" />
                </label>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <switch-button
              :checked="addMinisterRole"
              :label="t('field.minister-role')"
              @update:model-value="addMinisterRole = $event" />
            <div v-if="addMinisterRole">
              <div v-for="position of ministers" class="space-y-8">
                <div>
                  <label :for="position.value">
                    <input
                      type="checkbox"
                      class="form-checkbox"
                      :id="position.value"
                      :checked="ministerRoles.includes(position.value)"
                      :data-role="position.value"
                      v-on:change="handleMinisterRoles($event)" />
                    <span class="ml-2 text-sm font-medium">{{ t(position.label) }}</span>
                  </label>
                  <label
                    v-if="ministerRoles.includes(position.value)"
                    :for="`${position}-trait`"
                    class="my-2 block">
                    <form-group
                      type="text"
                      :id="`${position}-trait`"
                      v-model.trim="ministerTraits[position.value]"
                      :label="t('field.traits')" />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <switch-button
              :checked="addOfficerRole"
              :label="t('field.officer-role')"
              @update:model-value="addOfficerRole = $event" />
            <div v-if="addOfficerRole">
              <div v-for="position of officers" class="space-y-8">
                <div>
                  <label :for="position.value">
                    <input
                      type="checkbox"
                      class="form-checkbox"
                      :id="position.value"
                      :checked="officerRoles.includes(position.value)"
                      :data-role="position.value"
                      v-on:change="handleOfficerRoles($event)" />
                    <span class="ml-2 text-sm font-medium">{{ t(position.label) }}</span>
                  </label>
                  <label
                    v-if="officerRoles.includes(position.value)"
                    :for="`${position}-trait`"
                    class="my-2 block">
                    <form-group
                      type="text"
                      :id="`${position}-trait`"
                      v-model.trim="officerTraits[position.value]"
                      :label="t('field.traits')" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <button type="button" class="button-secondary" @click="$emit('hide')">
            {{ t('action.cancel') }}
          </button>
          <spinner-button type="submit" class="button-primary" :loading="loading">
            <template #content>
              <check-icon class="mr-2 h-4 w-4" />
              {{ t('action.create') }}
            </template>
            <template #loading>
              <span>{{ t('loading.saving') }}</span>
            </template>
          </spinner-button>
        </div>
      </form>
    </template>
  </modal>
</template>

<i18n lang="json">
{
  "en": {
    "create": {
      "heading": "Create Character"
    }
  }
}
</i18n>
