<template>
  <div class="flex items-center gap-x-2">
    <span
      class="text-sm font-medium text-gray-600"
      :class="{ 'font-bold': !isOn }"
    >
      {{ data[Object.keys(data)[0]] }}
    </span>
    <button
      type="button"
      aria-pressed="isOn"
      aria-labelledby="toggleLabel"
      class="
        bg-gray-200
        relative
        inline-flex
        flex-shrink-0
        h-6
        w-11
        border-2 border-transparent
        rounded-full
        cursor-pointer
        transition-colors
        ease-in-out
        duration-200
        focus:outline-none
      "
      @click="input"
    >
      <span
        aria-hidden="true"
        :class="isOn ? 'translate-x-5' : 'translate-x-0'"
        class="
          translate-x-0
          inline-block
          h-5
          w-5
          rounded-full
          bg-white
          shadow
          transform
          ring-0
          transition
          ease-in-out
          duration-200
        "
      >
      </span>
    </button>
    <span
      class="text-sm font-medium text-gray-600"
      :class="{ 'font-bold': isOn }"
    >
      {{ data[Object.keys(data)[1]] }}
    </span>
  </div>
</template>

<script>
export default {
  props: ["modelValue", "data"],
  computed: {
    isOn() {
      return this.modelValue === Object.keys(this.data)[1];
    },
  },
  methods: {
    input() {
      if (this.isOn) this.$emit("update:modelValue", Object.keys(this.data)[0]);
      else this.$emit("update:modelValue", Object.keys(this.data)[1]);
    },
  },
};
</script>
