<script lang="ts">
import Dropdown from '@components/dropdown.vue'
import getLanguageName from '@shared/core/locale'

export default {
  name: 'LocaleSwitcher',
  components: { Dropdown },
  methods: {
    getLanguageName
  }
}
</script>

<template>
  <div class="locale-changer w-32">
    <dropdown
      :options="$i18n.availableLocales"
      :model-value="$i18n.locale"
      :display-key="(e) => getLanguageName(e as string)"
      :value-key="(e) => e"
      @update:model-value="$i18n.locale = $event" />
  </div>
</template>
