<template>
  <div class="flex justify-center items-center gap-x-2 text-gray-500">
    <svg-chevron-left-double
      class="h-4"
      :class="{
        'cursor-pointer text-gray-500 hover:text-gray-800': modelValue > 1,
        'text-gray-300': modelValue <= 1,
      }"
      @click="setOne"
    />
    <svg-chevron-left
      class="h-4"
      :class="{
        'cursor-pointer text-gray-500 hover:text-gray-800': modelValue > 1,
        'text-gray-300': modelValue <= 1,
      }"
      @click="subtractOne"
    />
    <input
      v-model="manualValue"
      @blur="manualUpdate"
      pattern="[0-9]+"
      class="p-0 m-0 w-16 border-none font-semibold text-center bg-opacity-0"
    />
    <svg-chevron-right
      class="h-4"
      :class="{
        'cursor-pointer text-gray-500 hover:text-gray-800': modelValue < max,
        'text-gray-300': modelValue >= max,
      }"
      @click="addOne"
    />
    <svg-chevron-right-double
      class="h-4"
      :class="{
        'cursor-pointer text-gray-500 hover:text-gray-800': modelValue < max,
        'text-gray-300': modelValue >= max,
      }"
      @click="setMax"
    />
  </div>
</template>

<script>
import SvgChevronLeft from "/src/svg/ChevronLeft.vue";
import SvgChevronLeftDouble from "/src/svg/ChevronLeftDouble.vue";
import SvgChevronRight from "/src/svg/ChevronRight.vue";
import SvgChevronRightDouble from "/src/svg/ChevronRightDouble.vue";

export default {
  components: {
    SvgChevronLeft,
    SvgChevronLeftDouble,
    SvgChevronRight,
    SvgChevronRightDouble,
  },

  props: {
    modelValue: {
      default: 1,
    },

    max: {
      default: 1,
    },
  },

  data() {
    return {
      manualValue: this.modelValue,
    };
  },

  emits: ["update:modelValue"],

  watch: {
    modelValue() {
      this.manualValue = this.modelValue;
    },
  },

  methods: {
    setOne() {
      this.$emit("update:modelValue", 1);
    },

    addOne() {
      if (this.modelValue < this.max)
        this.$emit("update:modelValue", this.modelValue + 1);
    },

    setMax() {
      this.$emit("update:modelValue", this.max);
    },

    subtractOne() {
      if (this.modelValue > 1)
        this.$emit("update:modelValue", this.modelValue - 1);
    },

    manualUpdate() {
      console.log("manualValue", this.manualValue);
      if (
        isNaN(parseFloat(this.manualValue)) ||
        isNaN(this.manualValue - 0) ||
        this.manualValue % 1 != 0 ||
        this.manualValue < 1 ||
        this.manualValue > this.max
      ) {
        this.manualValue = this.modelValue;
        return;
      }

      this.$emit("update:modelValue", parseInt(this.manualValue));
    },
  },
};
</script>