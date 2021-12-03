<template>
  <div v-if="show">
    <div class="flex justify-between items-center mb-4 border-b pb-2 mt-10">
      <div class="text-xl">Timestamp Settings</div>
      <div>
        (see
        <a
          class="text-blue-400 hover:text-blue-800"
          href="https://momentjs.com/docs/#/parsing/string-format/"
          target="_blank"
          >moment.js</a
        >
        )
      </div>
    </div>

    <div class="flex justify-between gap-x-4">
      <!--Parse as-->
      <div class="w-full">
        <div class="mb-2 flex justify-between">
          <div class="text-sm font-semibold">Parse as</div>
          <my-switch
            :options="inputModes"
            v-model="columns.timestamp.params.parsingMode"
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
              v-show="columns.timestamp.params.parsingMode.id === 'auto'"
              class="rounded-md py-1 w-full"
              type="text"
              :disabled="true"
              placeholder="auto mode"
            />
            <jet-input
              v-show="columns.timestamp.params.parsingMode.id === 'custom'"
              class="rounded-md py-1 w-full"
              type="text"
              v-model="columns.timestamp.params.parsingString"
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
            v-model="columns.timestamp.params.outputMode"
          />
        </div>
        <dashed-box class="gap-x-4 items-center border-gray-500 h-32">
          <div class="w-full">
            <div class="mb-1">Output format</div>
            <jet-input
              v-show="columns.timestamp.params.outputMode.id === 'auto'"
              class="rounded-md py-1 w-full"
              type="text"
              :disabled="true"
              placeholder="Unix Epoch [ms]"
            />
            <jet-input
              v-show="columns.timestamp.params.outputMode.id === 'custom'"
              class="rounded-md py-1 w-full"
              type="text"
              v-model="columns.timestamp.params.outputString"
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
                <div
                  class="flex justify-end font-semibold text-sm text-blue-300"
                >
                  {{ formatted.raw }}
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
                  {{
                    formatted.error ? formatted.errorMsg : formatted.formatted
                  }}
                </div>
              </div>
            </div>

            <!--Preview navigator-->
            <div class="flex justify-between items-center mt-1 border-t pt-1">
              <div class="mb-1">Row index</div>
              <div
                class="flex justify-center items-center gap-x-2 text-gray-500"
              >
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
      if (this.columns === null) return;
      //Update timestamp column, if timestamp tags changed
      let timestampColumns = helpers.getColumnsByTag(this.columns, "timestamp");
      let timestampFields = helpers.collectColumnFields(timestampColumns);
      let tagsChanged =
        this.columns.timestamp.fields.join(",") !== timestampFields.join(",");

      if (tagsChanged) this.columns.timestamp.fields = timestampFields;
    },
  },

  computed: {
    show() {
      return this.columns !== null && this.columns.timestamp.fields.length > 0;
    },

    formatted() {
      if (!this.show || this.parsedData === null) return null;

      let row = this.parsedData[this.previewIndex];
      return formatter.format(row, this.columns.timestamp);
    },
  },
};
</script>