<template>
  <div v-if="show">
    <section-title :hideIntro="!showExplanations">
      Timestamp Settings
      <template #intro>
        The columns in the Time / Date category (section 'Columns') are combined
        into one string that can be parsed as date by
        <a
          class="text-blue-400 hover:text-blue-800"
          href="https://momentjs.com/docs/#/parsing/string-format/"
          target="_blank"
          >moment.js</a
        >
        and converted into your desired target timestamp. Use the preview row
        selector to try your settings on various rows.
      </template>
    </section-title>

    <div class="flex justify-between gap-x-4">
      <!--Parse as-->
      <div class="w-full">
        <div class="mb-2 flex justify-between">
          <div class="text-sm font-semibold h-6">Parsing</div>
        </div>
        <dashed-box
          class="gap-x-4 items-center"
          :class="{
            'border-red-500': timestampParsingError,
            'border-gray-500': !timestampParsingError,
          }"
        >
          <div class="w-full">
            <!--Value to parse-->
            <value>
              <template #title>Timestring to parse</template>
              {{ rawString }}
            </value>

            <!--parsing string-->
            <div>
              <div class="flex justify-between">
                <div class="mb-1 text-sm font-semibold">Parsing string</div>
                <my-switch
                  :options="inputModes"
                  v-model="columns.timestamp.params.parsingMode"
                />
              </div>
              <jet-input
                v-show="columns.timestamp.params.parsingMode.id === 'auto'"
                class="rounded-md py-1 w-full"
                type="text"
                :disabled="true"
                placeholder="auto detection"
              />
              <jet-input
                v-show="columns.timestamp.params.parsingMode.id === 'custom'"
                class="rounded-md py-1 w-full"
                type="text"
                v-model="columns.timestamp.params.parsingString"
              />
            </div>
          </div>
        </dashed-box>
        <div class="text-sm text-gray-500 mt-2" v-show="showExplanations">
          Make use of the automated parsing mode or set a custom parsing string.
          Please see
          <a
            class="text-blue-400 hover:text-blue-800"
            href="https://momentjs.com/docs/#/parsing/string-format/"
            target="_blank"
            >moment.js</a
          >
          for more information about the parsing string.
        </div>
      </div>

      <!--Format as -->
      <div class="w-full">
        <div class="mb-2 flex justify-between items-center">
          <div class="text-sm font-semibold">Formatting</div>
          <div class="flex justify-end gap-x-2 items-center">
            <div class="uppercase text-xs text-gray-500 font-semibold">
              preview row
            </div>
            <preview
              :parsedData="parsedData"
              :column="columns.timestamp"
              :hideBox="true"
              @update="updatePreview"
            />
          </div>
        </div>
        <dashed-box class="gap-x-4 items-center border-gray-500">
          <div class="w-full">
            <!--Value to parse-->
            <value :error="formatted.error">
              <template #title>Formatted timestamp</template>
              {{ formatted.error ? formatted.errorMsg : formatted.formatted }}
            </value>
            <!--Output format-->
            <div>
              <div class="flex justify-between">
                <div class="mb-1 text-sm font-semibold">Format string</div>
                <my-switch
                  :options="outputModes"
                  v-model="columns.timestamp.params.outputMode"
                />
              </div>
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
          </div>
        </dashed-box>
        <div class="text-sm text-gray-500 mt-2" v-show="showExplanations">
          Inspect the parsed an formatted output timestamp. Make sure,
          this value was interpreted correctly e.g. by using the same string for
          parsing and formatting.
        </div>
      </div>

      <!--Preview box-->
      <!--<div class="w-full">
        <div class="mb-2 flex justify-between">
          <div class="text-sm font-semibold">Preview</div>
        </div>
        <dashed-box class="border-gray-500 block h-32">
          <div class="w-full">
            <preview
              :parsedData="parsedData"
              :column="columns.timestamp"
              :hideBox="false"
            />
          </div>
        </dashed-box>
      </div>-->
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
import PreviewNavigator from "/src/components/PreviewNavigator.vue";

export default {
  components: {
    SvgCheck,
    JetInput,
    DashedBox,
    MySwitch,
    Preview,
    PreviewNavigator,
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

    showExplanations: {
      default: true,
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
      show: false,
      rawString: null,
      formatted: null,
      previewIndex: null,
    };
  },

  watch: {
    columns: {
      handler(val, oldVal) {
        if (val === null) this.show = false;
        else this.updateColumns();
      },
      deep: true,
    },
  },

  methods: {
    updatePreview(rawString, formatted, previewIndex) {
      this.rawString = rawString;
      this.formatted = formatted;
      this.previewIndex = previewIndex;
    },

    updateColumns() {
      let timestampColumns = helpers.getColumnsByTag(this.columns, "timestamp");

      if (Object.keys(timestampColumns).length > 0) {
        //Get timestamp fields
        let timestampFields = helpers.collectColumnFields(timestampColumns);
        //Update timestamp entry
        if (this.columns.hasOwnProperty("timestamp")) {
          //get the fields

          //compare fields and update if changed
          if (
            this.columns.timestamp.fields.join(",") !==
            timestampFields.join(",")
          )
            this.columns.timestamp.fields = timestampFields;
        }

        //Create timestamp entry
        else {
          this.columns["timestamp"] = {
            fields: timestampFields,
            name: "timestamp",
            id: "timestamp",
            rule: null,
            tags: [],
            origin: "app",
            params: {
              parsingMode: this.inputModes[0],
              parsingString: "DD.MM.YYYY HH:mm:ss.SSS",
              outputMode: this.outputModes[0],
              outputString: "DD.MM.YYYY HH:mm:ss.SSS",
            },
          };
        }
        this.show = true;
      }

      //Delete entry
      else {
        this.show = false;
        if (this.columns.hasOwnProperty("timestamp"))
          delete this.columns.timestamp;
      }
    },
  },
};
</script>