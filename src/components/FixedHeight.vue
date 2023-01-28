<script lang="ts">
import { h, onMounted, onUnmounted } from 'vue'

export default {
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
}
</script>
