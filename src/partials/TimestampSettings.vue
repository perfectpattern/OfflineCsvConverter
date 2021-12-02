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
              focus:outline-none focus:ring-0 focus:border-blue-200
              rounded-md
              shadow-sm
            "
            :modelValue="timestampSettings.parsingMode"
            @change="emit('parsingMode', $event.target.value)"
          >
            <option value="auto">Auto</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <div class="mb-1">String:</div>
          <jet-input
            v-show="timestampSettings.parsingMode === 'auto'"
            class="rounded-md py-1"
            type="text"
            :disabled="true"
            placeholder="auto mode"
          />
          <jet-input
            v-show="timestampSettings.parsingMode === 'custom'"
            class="rounded-md py-1"
            type="text"
            :disabled="timestampSettings.parsingMode === 'auto'"
            placeholder="DD MM YYYY hh:mm:ss"
            :modelValue="timestampSettings.parsingString"
            @update:modelValue="emit('parsingString', $event)"
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
              focus:outline-none focus:ring-0 focus:border-blue-200
              rounded-md
              shadow-sm
            "
            :modelValue="timestampSettings.outputMode"
            @change="emit('outputMode', $event.target.value)"
          >
            <option value="auto">Unix Timestamp (ms)</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <div class="mb-1">String:</div>
          <jet-input
            v-show="timestampSettings.outputMode === 'auto'"
            class="rounded-md py-1"
            type="text"
            :disabled="true"
            placeholder="auto mode"
          />
          <jet-input
            v-show="timestampSettings.outputMode === 'custom'"
            class="rounded-md py-1"
            type="text"
            placeholder="YYYY MM DD"
            :modelValue="timestampSettings.outputString"
            @update:modelValue="emit('outputString', $event)"
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

  props: {
    timestampSettings: {
      type: Object,
      default: {
        parsingMode: "auto",
        parsingString: "DD MM YYYY hh:mm:ss",
        outputMode: "auto",
        outputString: "YYYY MM DD",
      },
    },

    timestampParsingError: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:timestampSettings"],

  methods: {
    emit(key, value) {
      let newTimestampSettings = this.timestampSettings;
      newTimestampSettings[key] = value;
      this.$emit("update:timestampSettings", newTimestampSettings);
    },
  },
};
</script>