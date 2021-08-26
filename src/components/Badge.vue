<template>
  <div
    class="inline-flex items-center py-0.5 rounded-md text-xs font-medium capitalize"
    :class="{
      'bg-gray-100 text-gray-700': color === 'gray',
      'bg-blue-200 text-white': color === 'blue',
      'bg-yellow-100 text-yellow-600': color === 'yellow',
      'bg-green-100 text-green-800': color === 'green',
      'bg-red-100 text-red-800': color === 'red',
      'px-4': !narrow,
      'px-2': narrow,
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      color: String,
      default: "gray",
    },
    narrow: {
      default: false,
    },
  },
};
</script>
