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
      'bg-gray-700 hover:bg-gray-900 active:bg-blue-600':
        !disabled && color == 'gray',
      'bg-blue-700 hover:bg-blue-900 active:bg-blue-600':
        !disabled && color == 'blue',
      'bg-gray-200 cursor-default': disabled && color == 'gray',
      'bg-blue-200 cursor-default': disabled && color == 'blue',
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
    color: {
      default: "gray", //'blue'
    },
  },
};
</script>
