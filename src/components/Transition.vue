<template>
  <transition
    enter-from-class="transform opacity-0 scale-95"
    :enter-active-class="'transition ease-out duration-' + duration"
    enter-to-class="transform opacity-100 scale-100"
    leave-from-class="transform opacity-100 scale-100"
    :leave-active-class="'transition ease-in duration-' + duration"
    leave-to-class="transform opacity-0 scale-95"
  >
    <slot></slot>
  </transition>
</template>

<script>
export default {
  props: {
    duration: {
      default: 200,
    },
  },
};
</script>