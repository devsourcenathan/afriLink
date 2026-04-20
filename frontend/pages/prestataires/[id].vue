<script setup lang="ts">
const route = useRoute()

await navigateTo(`/providers/${route.params.id as string}`, { redirectCode: 301 })
</script>
