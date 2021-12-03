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
            <preview :parsedData="parsedData" :column="columns.timestamp" />
          </div>
        </dashed-box>
      </div>
    </div>
  </div>
</template>

<script>
import SvgCheck from "/src/svg/Check.vue";
import JetInput from "/src/components/jetstream/Input.vue";
import DashedBox from "/src/components/DashedBox.vue";
import MySwitch from "/src/components/SwitchSmall.vue";
import Preview from "/src/components/Preview.vue";
import { helpers } from "/src/modules/helpers";

export default {
  components: {
    SvgCheck,
    JetInput,
    DashedBox,
    MySwitch,
    Preview,
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
  },
};
</script>