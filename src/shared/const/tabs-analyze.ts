import DuplicateTab from '@/components/analyze/duplicate-tab.vue'
import OrphanedTab from '@/components/analyze/orphaned-tab.vue'
import { DocumentDuplicateIcon, QuestionMarkCircleIcon } from '@heroicons/vue/24/outline'

const tabs: TabData[] = [
  { icon: QuestionMarkCircleIcon, panel: OrphanedTab, label: 'tab.orphaned' },
  { icon: DocumentDuplicateIcon, panel: DuplicateTab, label: 'tab.duplicate' }
]

export default tabs
