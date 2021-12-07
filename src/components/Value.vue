<template>
  <div class="mb-2">
    <div class="flex justify-between items-center">
      <div class="mb-1 text-sm font-semibold"><slot name="title"></slot></div>
      <slot name="complement"></slot>
    </div>

    <div
      class="font-semibold text-sm border px-4 py-1.5 rounded-md"
      :class="{
        'text-red-500 font-bold': error,
        'text-blue-300': !error,
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      default: false,
    },
  },
};
</script>