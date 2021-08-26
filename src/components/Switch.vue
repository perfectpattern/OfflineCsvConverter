<template>
  <div class="bg-gray-200 rounded-lg p-0.5 flex">
    <button
      type="button"
      class="
        transition
        duration-500
        rounded-md
        py-2
        text-sm
        whitespace-nowrap
        focus:outline-none
        sm:w-auto
        sm:px-8
      "
      :class="{
        'bg-white border-gray-200 shadow-sm text-gray-600 font-bold':
          modelValue === Object.keys(data)[0],
        'border border-transparent text-gray-400 font-semibold text-opacity-80':
          modelValue !== Object.keys(data)[0],
        'hover:text-gray-500': modelValue !== Object.keys(data)[0] && !disabled,
        'cursor-pointer': !disabled,
        'cursor-auto': disabled,
      }"
      @click="inputChanged(Object.keys(data)[0])"
    >
      {{ data[Object.keys(data)[0]] }}
    </button>
    <button
      type="button"
      class="
        transition
        duration-500
        rounded-md
        py-2
        text-sm
        font-semibold
        whitespace-nowrap
        focus:outline-none
        sm:w-auto
        sm:px-8
        ml-0.5
      "
      :class="{
        'bg-white border-gray-200 shadow-sm text-gray-600 font-bold':
          modelValue === Object.keys(data)[1],
        'border border-transparent text-gray-400 font-semibold text-opacity-80':
          modelValue !== Object.keys(data)[1],
        'hover:text-gray-500': modelValue !== Object.keys(data)[1] && !disabled,
        'cursor-pointer': !disabled,
        'cursor-auto': disabled,
      }"
      @click="inputChanged(Object.keys(data)[1])"
    >
      {{ data[Object.keys(data)[1]] }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      default: null,
    },
    data: {
      default: { key1: "text1", key2: "text2" },
    },
    disabled: {
      default: false,
    },
  },

  emits: ["update:modelValue"],
  methods: {
    inputChanged(value) {
      if (this.disabled) return;
      if (value === this.modelValue) return;
      this.$emit("update:modelValue", value);
    },
  },
};
</script>
