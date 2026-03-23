<template>
  <div class="flex h-screen w-full bg-gray-50 dark:bg-gray-950 overflow-hidden">
    <!-- Sidebar Component -->
    <DashboardSidebar class="hidden md:flex" />

    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <!-- Header Component -->
      <DashboardHeader />

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardSidebar from '~/components/dashboard/Sidebar.vue';
import DashboardHeader from '~/components/dashboard/Header.vue';
</script>
