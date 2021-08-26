<template>
  <div class="flex justify-between gap-x-4">
    <div class="w-full">
      <h3 class="text-base">Parsing</h3>
      <div
        class="
          flex
          w-full
          gap-x-4
          border-2 border-dashed
          rounded-md
          p-4
          items-center
          overflow-y-auto overflow-x-hidden
        "
        :class="{
          'border-red-500': timestampParsingError,
          'border-gray-500': !timestampParsingError,
        }"
      >
        <div>
          <div>Mode:</div>
          <select
            class="rounded-md py-1"
            v-model="parsingMode"
            @change="changed()"
          >
            <option value="auto">Auto</option>
            <option value="custom">Custom</option>
          </select>
          <div class="text-sm">&nbsp;</div>
        </div>

        <div v-show="parsingMode === 'custom'">
          <div>String:</div>
          <input
            class="rounded-md py-1"
            type="text"
            placeholder="DD MM YYYY hh:mm:ss"
            v-model="parsingString"
            @change="changed()"
          />
          <div class="text-sm">
            See
            <a
              class="text-blue-400 hover:text-blue-800"
              href="https://momentjs.com/docs/#/parsing/string-format/"
              target="_blank"
              >moment.js</a
            >
          </div>
        </div>

        <div
          v-show="timestampParsingError"
          class="text-red-500 text-xs font-bold"
        >
          At least one date in the shown sample could not be parsed.
        </div>
        <svg-check v-show="!timestampParsingError" class="text-green-600 h-7" />
      </div>
    </div>

    <div class="w-full">
      <h3 class="text-base">Output</h3>
      <div
        class="
          flex
          w-full
          gap-x-4
          border-2 border-dashed border-gray-500
          rounded-md
          p-4
          overflow-y-auto overflow-x-hidden
        "
      >
        <div>
          <div>Mode:</div>
          <select
            class="rounded-md py-1"
            v-model="outputMode"
            @change="changed()"
          >
            <option value="auto">Unix Timestamp (ms)</option>
            <option value="custom">Custom</option>
          </select>
          <div class="text-sm">&nbsp;</div>
        </div>

        <div  v-show="outputMode === 'custom'">
          <div>String:</div>
          <input
            class="rounded-md py-1"
            type="text"
            placeholder="YYYY MM DD"
            v-model="outputString"
            @change="changed()"
          />
          <div class="text-sm">
            See
            <a
              class="text-blue-400 hover:text-blue-800"
              href="https://momentjs.com/docs/#/displaying/"
              target="_blank"
              >moment.js</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SvgCheck from "/src/svg/Check.vue";

export default {
  components: {
    SvgCheck,
  },

  props: ["timestampParsingError"],

  data() {
    return {
      parsingMode: "auto",
      parsingString: "DD MM YYYY hh:mm:ss",
      outputMode: "auto",
      outputString: "YYYY MM DD",
    };
  },

  methods: {
    changed() {
      this.$emit("changed", {
        parsingMode: this.parsingMode,
        parsingString: this.parsingString,
        outputMode: this.outputMode,
        outputString: this.outputString,
      });
    },
  },
};
</script>