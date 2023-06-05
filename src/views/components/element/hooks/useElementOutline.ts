import { computed, Ref } from 'vue'
import { PPTElementOutline } from '@/types/slides'

// Calculate and border attribute value, mainly is for the default processing
export default (outline: Ref<PPTElementOutline | undefined>) => {
  const outlineWidth = computed(() => outline.value?.width ?? 0)
  const outlineStyle = computed(() => outline.value?.style || 'solid')
  const outlineColor = computed(() => outline.value?.color || '#d14424')

  return {
    outlineWidth,
    outlineStyle,
    outlineColor,
  }
}