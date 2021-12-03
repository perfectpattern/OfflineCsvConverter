<template>
  <div class="w-full">
    <div v-if="column !== null">
      <div class="flex justify-between items-center">
        <div class="mb-1">Input</div>
        <div class="flex justify-end font-semibold text-sm text-blue-300">
          {{ rawString }}
        </div>
      </div>
      <div class="flex justify-between items-center">
        <div class="mb-1">Output</div>
        <div
          class="flex justify-end font-semibold text-sm"
          :class="{
            'text-red-500 font-bold': formatted.error,
            'text-blue-300': !formatted.error,
          }"
        >
          {{ formatted.error ? formatted.errorMsg : formatted.formatted }}
        </div>
      </div>
    </div>

    <!--Preview navigator-->
    <div class="flex justify-between items-center mt-1 border-t pt-1">
      <div class="mb-1">Row</div>
      <div class="flex justify-center items-center gap-x-2 text-gray-500">
        <svg-chevron-left-double
          class="h-4 cursor-pointer hover:text-gray-800"
          @click="previewIndex = 1"
        />
        <svg-chevron-left
          class="h-4 cursor-pointer hover:text-gray-800"
          @click="if (previewIndex > 1) previewIndex--;"
        />
        <input
          v-model="previewIndex"
          pattern="[0-9]{1,5}"
          class="
            p-0
            m-0
            w-20
            border-none
            font-semibold
            text-center
            bg-opacity-0
          "
        />
        <svg-chevron-right
          class="h-4 cursor-pointer hover:text-gray-800"
          @click="if (previewIndex < parsedData.length) previewIndex++;"
        />
        <svg-chevron-right-double
          class="h-4 cursor-pointer hover:text-gray-800"
          @click="previewIndex = parsedData.length - 1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { formatter } from "/src/modules/formatter";
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

  props: ["column", "parsedData"],

  data() {
    return {
      previewIndex: 1,
    };
  },

  computed: {
    formatted() {
      if (this.column === null) return null;
      let row = this.parsedData[this.previewIndex - 1];
      return formatter.format(row, this.column);
    },

    rawString() {
      console.log(this.formatted.raw);
      return this.formatted.raw.join(", ");
    },
  },
};
</script>