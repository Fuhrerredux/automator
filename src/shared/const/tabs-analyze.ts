import DuplicateTab from '@/components/analyze/duplicate-tab.vue'
import OrphanedTab from '@/components/analyze/orphaned-tab.vue'

const tabs: TabData[] = [
  { panel: DuplicateTab, label: 'tab.duplicate' },
  { panel: OrphanedTab, label: 'tab.orphaned' }
]

export default tabs
