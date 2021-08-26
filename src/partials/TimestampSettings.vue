<template>
  <div class="flex justify-between gap-x-4">
    <div class="w-full">
      <div class="mb-2">
        Parsing (see
        <a
          class="text-blue-400 hover:text-blue-800"
          href="https://momentjs.com/docs/#/parsing/string-format/"
          target="_blank"
          >moment.js</a
        >
        )
      </div>
      <dashed-box
        class="gap-x-4 items-center"
        :class="{
          'border-red-500': timestampParsingError,
          'border-gray-500': !timestampParsingError,
        }"
      >
        <div>
          <div class="mb-1">Mode:</div>
          <select
            class="
              py-1
              border-gray-300
              focus:outline-none
              focus:ring-0
              focus:border-blue-200
              rounded-md
              shadow-sm
            "
            v-model="parsingMode"
            @change="changed()"
          >
            <option value="auto">Auto</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <div class="mb-1">String:</div>
          <jet-input
            v-show="parsingMode === 'auto'"
            class="rounded-md py-1"
            type="text"
            :disabled="true"
            placeholder="auto mode"
          />
          <jet-input
            v-show="parsingMode === 'custom'"
            class="rounded-md py-1"
            type="text"
            :disabled="parsingMode === 'auto'"
            placeholder="DD MM YYYY hh:mm:ss"
            v-model="parsingString"
            @update:modelValue="changed()"
          />
        </div>

        <div>
          <!--Placeholder-->
          <div class="mb-1">&nbsp;</div>

          <div
            v-show="timestampParsingError"
            class="text-red-500 text-xs font-bold"
          >
            At least one date in the sample could not be parsed.
          </div>
          <svg-check
            v-show="!timestampParsingError"
            class="text-green-600 h-7"
          />
        </div>
      </dashed-box>
    </div>

    <div class="w-full">
      <div class="mb-2">
        Format as (see
        <a
          class="text-blue-400 hover:text-blue-800"
          href="https://momentjs.com/docs/#/parsing/string-format/"
          target="_blank"
          >moment.js</a
        >
        )
      </div>
      <dashed-box class="gap-x-4 items-center border-gray-500">
        <div>
          <div class="mb-1">Mode:</div>
          <select
            class="
              py-1
              border-gray-300
              focus:outline-none
              focus:ring-0
              focus:border-blue-200
              rounded-md
              shadow-sm
            "
            v-model="outputMode"
            @change="changed()"
          >
            <option value="auto">Unix Timestamp (ms)</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <div class="mb-1">String:</div>
          <jet-input
            v-show="outputMode === 'auto'"
            class="rounded-md py-1"
            type="text"
            :disabled="true"
            placeholder="auto mode"
          />
          <jet-input
            v-show="outputMode === 'custom'"
            class="rounded-md py-1"
            type="text"
            placeholder="YYYY MM DD"
            v-model="outputString"
            @change="changed()"
          />
        </div>
      </dashed-box>
    </div>
  </div>
</template>

<script>
import SvgCheck from "/src/svg/Check.vue";
import JetInput from "/src/components/jetstream/Input.vue";
import DashedBox from "/src/components/DashedBox.vue";

export default {
  components: {
    SvgCheck,
    JetInput,
    DashedBox,
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