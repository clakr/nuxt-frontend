<template>
    <Navbar />
    <NuxtErrorBoundary>
        <NuxtPage />
        <template #error="{ error, clearError }">
            {{ error }}
            <button @click="clearError">
                reset
            </button>
        </template>
    </NuxtErrorBoundary>
</template>
  