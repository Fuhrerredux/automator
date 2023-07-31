<script setup lang="ts">
import { nanoid } from 'nanoid'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import CharacterRepository from '@/database/repository'
import Dropdown from '@components/dropdown.vue'
import FormGroup from '@components/form-group.vue'
import Modal from '@components/modal.vue'
import SpinnerButton from '@components/spinner-button.vue'
import SwitchButton from '@components/switch.vue'
import { CheckIcon } from '@heroicons/vue/20/solid'
import { ideologies } from '@shared/const/ideology'
import { commanding, ministers, officers } from '@shared/const/roles'
import {
  getCommandingRole,
  getMinisterialRoles,
  getOfficerRole,
  hasCommandingRole
} from '@shared/utils/character'
import useTraits from '@stores/traits'

const repository = CharacterRepository.getInstance()
const { traits } = useTraits()
const { t } = useI18n({ useScope: 'local' })
const $toast = useToast()
const loading = ref(false)
const { open, character, refresh } = defineProps<{
  open: boolean
  character: CharacterWithId | null
  refresh: () => Promise<void>
}>()
const emit = defineEmits(['hide'])

const tag = ref<string>('')
const name = ref<string>('')
const ideology = ref<Ideology>(ideologies[0].value)
const addLeaderRole = ref(false)
const addCommandingRole = ref(false)
const addMinisterRole = ref(false)
const addOfficerRole = ref(false)

const leaderTraits = ref<string>('')

const commandingRole = ref<CommandingRole>(commanding[0].value)
const commanderTraits = ref<string>('')
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

onMounted(() => {
  if (character) {
    tag.value = character.tag
    name.value = character.name
    ideology.value = character.ideology
    addLeaderRole.value = character.roles.includes('leader')
    addCommandingRole.value = hasCommandingRole(character)
    addMinisterRole.value = character.roles.includes('minister')
    addOfficerRole.value = character.roles.includes('officer')
    leaderTraits.value = character.leaderTraits.join(',')
    commanderTraits.value = character.commanderTraits.join(',')
    ministerTraits.value = character.ministerTraits
    officerTraits.value = character.officerTraits

    const commanding = getCommandingRole(character)
    if (commanding) commandingRole.value = commanding

    ministerRoles.value = getMinisterialRoles(character)
    officerRoles.value = getOfficerRole(character)
  }
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
    if (addOfficerRole.value) roles.push('officer')

    const ministers: Position[] = ministerRoles.value
    const officers: Position[] = officerRoles.value
    const positions: Position[] = ministers.concat(officers)

    const data: CharacterWithId = {
      id: character ? character.id : nanoid(),
      name: name.value,
      tag: tag.value,
      cost: 150,
      ideology: ideology.value,
      commanderTraits: commanderTraits.value.split(','),
      leaderTraits: leaderTraits.value.split(','),
      ministerTraits: ministerTraits.value,
      officerTraits: officerTraits.value,
      positions,
      roles
    }

    if (character) await repository.update(data)
    else await repository.create(data)
    $toast.success(t('status.saved'))
    await refresh()
    emit('hide')
  } catch (e) {
    $toast.error(String(e))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <modal :hideable="!loading" :open="open" size="max-w-2xl" @hide="$emit('hide')">
    <template #title>
      {{ t(character ? 'modal.character-editor.update' : 'modal.character-editor.create') }}
    </template>
    <template #body>
      <form @submit.prevent="submit">
        <div class="flex items-start justify-start gap-4">
          <!-- Left -->
          <div class="w-full space-y-2">
            <div>
              <label for="name">
                <form-group
                  required
                  type="text"
                  id="name"
                  v-model.trim="name"
                  :label="t('field.name')"
                  :placeholder="t('placeholder.name')"
                  :disabled="loading" />
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
                    :placeholder="t('placeholder.tag')"
                    :disabled="loading" />
                </label>
              </div>
              <div class="w-full">
                <label for="ideology">
                  <span class="form-label">{{ t('field.ideology') }}</span>
                  <dropdown
                    localise
                    value-key="value"
                    display-key="label"
                    :model-value="ideology"
                    :options="ideologies"
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
                      :label="t('field.traits')"
                      :disabled="loading" />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <!-- Right -->
          <div class="w-full space-y-2">
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
                      <dropdown
                        v-if="traits[position.value]"
                        :options="traits[position.value]"
                        :display-key="(e) => e"
                        :value-key="(e) => e"
                        :model-value="ministerTraits[position.value]"
                        @update:model-value="ministerTraits[position.value] = $event" />
                      <form-group
                        type="text"
                        v-if="!traits[position.value]"
                        v-model.trim="ministerTraits[position.value]"
                        :id="`${position}-trait`"
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
                      <dropdown
                        v-if="traits[position.value]"
                        :options="traits[position.value]"
                        :display-key="(e) => e"
                        :value-key="(e) => e"
                        :model-value="officerTraits[position.value]"
                        @update:model-value="officerTraits[position.value] = $event" />
                      <form-group
                        type="text"
                        v-if="!traits[position.value]"
                        v-model.trim="officerTraits[position.value]"
                        :id="`${position}-trait`"
                        :label="t('field.traits')" />
                    </label>
                  </div>
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
