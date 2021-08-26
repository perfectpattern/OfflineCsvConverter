<template>
  <div class="border-b border-gray-200 flex justify-between">
    <nav class="-mb-px flex space-x-8" aria-label="Tabs">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        @click="change(tab.key)"
        :class="{
          'border-blue-300 text-blue-300': modelValue === tab.key,
          'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
            modelValue !== tab.key,
          'cursor-pointer': !disabled,
          'cursor-not-allowed': disabled,
        }"
        class="py-4 px-1 text-center border-b-2 text-sm font-semibold"
      >
        {{ tab.name }}
      </div>
    </nav>
    <div class="flex items-center justify-end">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      default: "one",
    },
    tabs: {
      default: [
        { key: "one", name: "One" },
        { key: "two", name: "Two" },
        { key: "three", name: "Three" },
      ],
    },
    disabled: {
      default: false,
    },
  },
  emits: ["update:modelValue"],

  methods: {
    change(key) {
      if (key === this.modelValue || this.disabled) return;
      this.$emit("update:modelValue", key);
    },
  },
};
</script>

