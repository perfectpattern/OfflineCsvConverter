<template>
  <button
    :type="type"
    :disabled="disabled"
    class="
      inline-flex
      items-center
      rounded-md
      font-semibold
      text-xs text-white
      uppercase
      tracking-widest
      transition
      ease-in-out
      duration-150
      outline-none
      focus:outline-none
    "
    :class="{
      'bg-opacity-40': disabled,
      'px-8 py-4 text-lg': size === 'large',
      'px-4 py-2': size === 'normal',
      'px-3 py-1': size === 'small',
    }"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "submit",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      default: "normal", //'small', 'large'
    },
  },
};
</script>
