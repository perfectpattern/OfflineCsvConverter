<template>
  <div
    class="
      flex
      w-full
      border-2 border-dashed
      rounded-md
      overflow-y-auto overflow-x-hidden
    "
    :class="{
      'p-4': !noPadding,
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: { noPadding: false },
};
</script>