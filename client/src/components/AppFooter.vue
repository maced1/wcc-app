<template>
  <v-footer height="40" class="footer pa-0">
    <div class="footer-inner d-flex align-center justify-space-between px-4" style="width: 100%; height: 100%;">
      <div class="d-flex align-center">
        <div>
          <a
            v-for="item in items"
            :key="item.title"
            class="mx-2 social-link"
            :href="item.href"
            rel="noopener noreferrer"
            target="_blank"
            :title="item.title"
          >
            <v-icon :icon="item.icon" size="20" />
          </a>
        </div>
        <div class="text-caption text-disabled ml-4">
          Times shown in Raleigh local time
        </div>
      </div>
      <div class="text-caption text-disabled">
        {{ new Date().getFullYear() }} Matthew Siegel —
        <a
          class="text-decoration-none"
          href="https://github.com/maced1/wcc-app?tab=MIT-1-ov-file"
          rel="noopener noreferrer"
          target="_blank"
        >
          MIT License
        </a>
      </div>
    </div>
  </v-footer>
</template>

<script setup>
const items = [
  {
    title: 'GitHub',
    icon: 'mdi-github',
    href: 'https://github.com/maced1/wcc-app',
  },
  {
    title: 'Discord',
    icon: 'mdi-microphone-message',
    href: 'https://discord.gg/dFRvaXbA4R',
  },
  {
    title: 'Instagram',
    icon: 'mdi-instagram',
    href: 'https://www.instagram.com/wolfpack_cubing_club/',
  },
]
</script>

<style scoped lang="sass">
.social-link :deep(.v-icon)
  color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
  transition: 0.2s ease-in-out
  vertical-align: middle

  &:hover
    color: rgba(25, 118, 210, 1)
</style>