import { ref, onMounted } from 'vue'

export default function () {
  const raw = localStorage.getItem('theme') as Theme
  const theme = ref<Theme>(raw ?? 'auto')

  onMounted(() => {
    if (raw === 'dark') document.body.classList.add(raw)
  })

  const change = (current: Theme) => {
    theme.value = current
    if (current === 'dark') document.body.classList.add('dark')
    else document.body.classList.remove('dark')
    localStorage.setItem('theme', current)
  }

  return { theme, change }
}
