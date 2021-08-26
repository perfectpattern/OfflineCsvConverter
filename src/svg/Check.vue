<template>
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-width="strokeWidth"
      d="M5 13l4 4L19 7"
    />
  </svg>
</template>
<script>
export default {
  props: {
    strokeWidth: {
      default: 2,
    },
  },
};
</script>