<template>
  <div class="flex items-center justify-center gap-x-2">
    <span
      class="text-sm font-semibold text-gray-600"
      :class="{ 'font-bold': !isOn }"
    >
      {{ options[0].label }}
    </span>
    <button
      type="button"
      aria-pressed="isOn"
      aria-labelledby="toggleLabel"
      class="
        bg-blue-200
        relative
        inline-flex
        flex-shrink-0
        h-4
        w-8
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
        :class="isOn ? 'translate-x-4' : 'translate-x-0'"
        class="
          translate-x-0
          inline-block
          h-3
          w-3
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
      class="text-sm font-semibold text-gray-600"
      :class="{ 'font-bold': isOn }"
    >
      {{ options[1].label }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      default: { id: "one", label: "One" },
    },
    options: {
      default: [
        { id: "one", label: "One" },
        { id: "two", label: "Two" },
      ],
    },
  },

  emits: ["update:modelValue"],

  data() {
    return {
      isOn: false,
    };
  },

  created() {
    this.isOn = this.modelValue.id === this.options[1].id;
  },

  methods: {
    input() {
      if (this.modelValue.id === this.options[0].id) {
        this.$emit("update:modelValue", this.options[1]);
        this.isOn = true;
      } else {
        this.$emit("update:modelValue", this.options[0]);
        this.isOn = false;
      }
    },
  },
};
</script>