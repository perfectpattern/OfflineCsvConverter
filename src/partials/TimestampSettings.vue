<template>
  <div
    class="flex justify-between gap-x-4"
    v-if="rules.hasOwnProperty('timestamp')"
  >
    <!--Parse as-->
    <div class="w-full">
      <div class="mb-2 flex justify-between">
        <div class="text-sm font-semibold">Parse as</div>
        <my-switch
          :options="inputModes"
          v-model="rules.timestamp.app.parsingMode"
          @update:modelValue="$emit('update:rules', rules)"
        />
      </div>
      <dashed-box
        class="gap-x-4 items-center h-32"
        :class="{
          'border-red-500': timestampParsingError,
          'border-gray-500': !timestampParsingError,
        }"
      >
        <div class="w-full">
          <div class="mb-1">Input format</div>
          <jet-input
            v-show="rules.timestamp.app.parsingMode.id === 'auto'"
            class="rounded-md py-1 w-full"
            type="text"
            :disabled="true"
            placeholder="auto mode"
          />
          <jet-input
            v-show="rules.timestamp.app.parsingMode.id === 'custom'"
            class="rounded-md py-1 w-full"
            type="text"
            v-model="rules.timestamp.app.parsingString"
            @update:modelValue="$emit('update:rules', rules)"
          />
        </div>
      </dashed-box>
    </div>

    <!--Format as -->
    <div class="w-full">
      <div class="mb-2 flex justify-between">
        <div class="text-sm font-semibold">Format as</div>
        <my-switch
          :options="outputModes"
          v-model="rules.timestamp.app.outputMode"
          @update:modelValue="$emit('update:rules', rules)"
        />
      </div>
      <dashed-box class="gap-x-4 items-center border-gray-500 h-32">
        <div class="w-full">
          <div class="mb-1">Output format</div>
          <jet-input
            v-show="rules.timestamp.app.outputMode.id === 'auto'"
            class="rounded-md py-1 w-full"
            type="text"
            :disabled="true"
            placeholder="Unix Epoch [ms]"
          />
          <jet-input
            v-show="rules.timestamp.app.outputMode.id === 'custom'"
            class="rounded-md py-1 w-full"
            type="text"
            v-model="rules.timestamp.app.outputString"
            @update:modelValue="$emit('update:rules', rules)"
          />
        </div>
      </dashed-box>
    </div>

    <!--Preview box-->
    <div class="w-full">
      <div class="mb-2 flex justify-between">
        <div class="text-sm font-semibold">Preview</div>
      </div>
      <dashed-box class="border-gray-500 block h-32">
        <div class="w-full">
          <div class="w-full">
            <div class="flex justify-between items-center">
              <div class="mb-1">Input</div>
              <div class="flex justify-end font-semibold text-sm text-blue-300">
                {{ raw }}
              </div>
            </div>
            <div class="flex justify-between items-center">
              <div class="mb-1">Output</div>
              <div
                class="flex justify-end font-semibold text-sm"
                :class="{
                  'text-red-500 font-bold': converted === 'ERROR',
                  'text-blue-300': converted !== 'ERROR',
                }"
              >
                {{ converted }}
              </div>
            </div>
          </div>

          <!--Preview navigator-->
          <div class="flex justify-between items-center mt-1 border-t pt-1">
            <div class="mb-1">Row index</div>
            <div class="flex justify-center items-center gap-x-2 text-gray-500">
              <svg-chevron-left-double
                class="h-4 cursor-pointer hover:text-gray-800"
                @click="previewIndex = 0"
              />
              <svg-chevron-left
                class="h-4 cursor-pointer hover:text-gray-800"
                @click="if (previewIndex > 0) previewIndex--;"
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
      </dashed-box>
    </div>
  </div>
</template>

<script>
import SvgCheck from "/src/svg/Check.vue";
import SvgChevronLeft from "/src/svg/ChevronLeft.vue";
import SvgChevronLeftDouble from "/src/svg/ChevronLeftDouble.vue";
import SvgChevronRight from "/src/svg/ChevronRight.vue";
import SvgChevronRightDouble from "/src/svg/ChevronRightDouble.vue";
import JetInput from "/src/components/jetstream/Input.vue";
import DashedBox from "/src/components/DashedBox.vue";
import MySwitch from "/src/components/SwitchSmall.vue";
import { helpers } from "/src/modules/helpers";
import { formatter } from "/src/modules/formatter";

export default {
  components: {
    SvgCheck,
    SvgChevronLeft,
    SvgChevronLeftDouble,
    SvgChevronRight,
    SvgChevronRightDouble,
    JetInput,
    DashedBox,
    MySwitch,
  },

  props: {
    rules: {
      type: Object,
    },

    columns: {
      default: null,
    },

    parsedData: {
      default: null,
    },

    timestampParsingError: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:rules"],

  data() {
    return {
      inputModes: [
        { id: "auto", label: "auto" },
        { id: "custom", label: "custom" },
      ],
      outputModes: [
        { id: "auto", label: "auto" },
        { id: "custom", label: "custom" },
      ],
      previewIndex: 0,
    };
  },

  watch: {
    columns() {
      let timestampColumns = helpers.getColumnsByTag(this.columns, "timestamp");
      //initialize timestamp rule
      if (!this.rules.hasOwnProperty("timestamp"))
        this.rules["timestamp"] = {
          columns: timestampColumns,
          code: null,
          create: false,
          name: null,
          app: {
            parsingMode: this.inputModes[0],
            parsingString: "DD.MM.YYYY HH:mm:ss.SSS",
            outputMode: this.outputModes[0],
            outputString: "DD.MM.YYYY HH:mm:ss.SSS",
          },
        };
      else this.rules.timestamp.columns = timestampColumns;

      //emit
      this.$emit("update:rules", this.rules);
    },
  },

  computed: {
    raw() {
      if (this.parsedData === null || !this.rules.hasOwnProperty("timestamp"))
        return null;
      let row = this.parsedData[this.previewIndex];
      let values = [];
      this.rules.timestamp.columns.forEach((column) => {
        values.push(row[column.field]);
      });
      return values.join(" ");
    },

    converted() {
      if (this.raw === null) return null;
      let response = formatter.format(this.raw, {
        isTimestamp: true,
        timestampSettings: this.rules.timestamp.app,
      });
      if (response.error) return "ERROR";
      return response.value;
    },
  },

  methods: {
    applyTimestampRule(rules, value) {},
  },
};
</script>