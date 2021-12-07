<template>
  <div v-if="showUI">
    <div v-if="hideBox">
      <preview-navigator v-model="previewIndex" :max="max" />
    </div>

    <div v-else class="w-full">
      <div>
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
        <preview-navigator v-model="previewIndex" :max="max" />
      </div>
    </div>
  </div>
</template>

<script>
import { formatter } from "/src/modules/formatter";

import PreviewNavigator from "/src/components/PreviewNavigator.vue";

export default {
  components: {
    PreviewNavigator,
  },

  props: {
    column: {
      default: null,
    },
    parsedData: {
      default: null,
    },
    hideBox: {
      default: false,
    },
  },

  data() {
    return {
      previewIndex: 1,
      rawString: null,
      formatted: null,
    };
  },

  emits: ["update"],

  created() {
    this.update();
  },

  watch: {
    column: {
      handler(val, oldVal) {
        this.update();
      },
      deep: true,
    },

    previewIndex() {
      this.update();
    },
  },

  computed: {
    showUI() {
      return this.rawString !== null && this.formatted !== null;
    },

    max() {
      return this.parsedData === null ? 1 : this.parsedData.length - 1;
    },
  },

  methods: {
    update() {
      if (this.column === null || this.parsedData === null) {
        this.formatted = null;
        this.rawString = null;
        return;
      }

      //get preview row
      let row = this.parsedData[this.previewIndex - 1];

      //format row
      this.formatted = formatter.format(row, this.column);

      //get raw string
      this.rawString = this.formatted.raw.join(", ");

      //emit
      this.$emit("update", this.rawString, this.formatted, this.previewIndex);
    },
  },
};
</script>