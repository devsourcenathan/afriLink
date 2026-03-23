<template>
  <div class="flex min-h-screen bg-white dark:bg-gray-950 font-sans">
    <!-- Form Side -->
    <div class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div class="mb-10">
          <NuxtLink to="/" class="flex items-center gap-2 mb-8 group cursor-pointer">
            <div class="bg-primary-600 rounded-lg p-2 text-white shadow-lg group-hover:bg-primary-500 transition-colors">
              <UIcon name="i-heroicons-globe-alt" class="w-6 h-6" />
            </div>
            <span class="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Afri<span class="text-primary-600">Link</span></span>
          </NuxtLink>
        </div>
        
        <!-- Slot where Nuxt renders our Auth pages -->
        <slot />
        
      </div>
    </div>
    
    <!-- Image / Abstract Side -->
    <div class="relative hidden w-0 flex-1 lg:block">
      <div class="absolute inset-0 h-full w-full bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900 overflow-hidden">
        <!-- Abstract Glassmorphism decorative circles -->
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div class="absolute top-40 -left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-40 right-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        
        <div class="flex flex-col justify-center items-center h-full relative z-10 px-12 text-center">
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Connecting Africa's <br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-pink-300">Finest Talents</span>
          </h2>
          <p class="text-xl text-primary-100 max-w-lg font-light">
            Join thousands of professionals and companies building the future of African services together.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
</style>
