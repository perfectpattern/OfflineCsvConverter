<template>
  <div class="mt-14 mb-5">
    <div class="pb-2 border-b border-blue-300 border-opacity-30">
      <div class="flex justify-between items-center">
        <h1 class="text-blue-300">
          <slot></slot>
        </h1>
        <slot name="complement"></slot>
      </div>
    </div>
    <div class="pt-3 text-gray-500 text-sm" v-show="!hideIntro">
      <slot name="intro"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hideIntro: {
      default: false,
    },
  },
};
</script>
