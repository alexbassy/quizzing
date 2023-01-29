<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  name: 'FixedHeight',
  // render nothing
  setup(_, { slots }) {
    onMounted(() => {
      document.body.style.overflow = 'hidden'
    })
    onUnmounted(() => {
      document.body.style.overflow = ''
    })
    return () => slots.default?.()
  },
})
</script>
