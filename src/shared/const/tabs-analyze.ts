import DuplicateTab from '@components/optimize/duplicate-tab.vue'
import OrphanedTab from '@components/optimize/orphaned-tab.vue'

const tabs: TabData[] = [
  { panel: DuplicateTab, label: 'tab.duplicate' },
  { panel: OrphanedTab, label: 'tab.orphaned' }
]

export default tabs
