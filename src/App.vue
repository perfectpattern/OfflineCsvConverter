<template>
  <div
    class="
      max-w-6xl
      mx-auto
      bg-gray-50 bg-opacity-50
      border-l border-r
      min-h-screen
    "
  >
    <!--Head Section-->
    <head-section />

    <div class="p-6">
      <div class="text-2xl mb-4 flex justify-between text-gray-500">
        <div>
          {{
            filename !== null
              ? filename
              : fromClipboard
              ? "Copied from clipboard"
              : "No CSV data yet"
          }}
        </div>
        <div class="flex justify-end gap-x-2">
          <my-button @click="reset" class="bg-red-500">Restart</my-button>
          <export
            :timestampColumn="timestampColumn"
            :sortedColumns="sortedColumns"
            :data="parsedData == null ? [] : parsedData.data"
            :timestampSettings="timestampSettings"
            :validData="validData"
            :renamings="renamings"
            :filename="filename"
          />
        </div>
      </div>

      <!--File input local-->
      <my-transition>
        <file-selector
          v-show="!validData"
          :accept="'.json, .csv, application/json, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'"
          :filename="filename"
          @file-selected="fileSelected"
          @read-clipboard="readClipboard"
        ></file-selector>
      </my-transition>

      <!--Errors-->
      <errors :errors="errors" />

      <!--If valid data-->
      <div v-show="validData">
        <!--Columns Sorting-->
        <div>
          <div class="flex justify-between items-center mb-4 border-b pb-2">
            <div class="text-xl mt-10">Sort Columns</div>
          </div>
          <columns-sorting
            :fields="allFields"
            v-model:renamings="renamings"
            v-model:sortedColumns="sortedColumns"
            v-model:timestampColumn="timestampColumn"
          />
        </div>

        <!--Timedate parsing  @updated-renamings="updateRenamings" @update:sortedColumns="updateSortedColumns" @update:timestampColumn="updateTimestampColumn"-->
        <div v-show="timestampColumn !== null">
          <div class="flex justify-between items-center mb-4 border-b pb-2">
            <div class="text-xl mt-10">Timestamp Settings</div>
          </div>
          <timestamp-settings
            @changed="timestampSettingsChanged"
            :timestampParsingError="timestampParsingError"
          />
        </div>

        <!--Output Data Preview-->
        <div>
          <div
            class="flex justify-between items-center mt-10 mb-4 border-b pb-2"
          >
            <div class="text-xl">CSV Data</div>

            <my-switch v-model="outputMode" :data="outputModes" />
          </div>
          <preview-table
            :parsedData="parsedData"
            :validData="validData"
            :outputMode="outputMode"
            :fields="sortedColumns"
            :renamings="renamings"
            :timestampColumn="timestampColumn"
            :timestampSettings="timestampSettings"
            @timestampParsingError="setTimestampParsingError"
          />
        </div>
      </div>

      <parser-csv :input="rawCsv" @parsing-finished="parsingFinished" />
      <parser-json :input="rawJson" @parsing-finished="parsingFinished" />
    </div>
  </div>
</template>

<script>
import DialogModal from "./components/jetstream/DialogModal.vue";
import MyNav from "./components/Nav.vue";
import MySwitch from "./components/SwitchSmall.vue";
import MyTransition from "./components/Transition.vue";
import MyButton from "./components/Button.vue";
import PreviewTable from "./partials/PreviewTable.vue";
import FileSelector from "./components/FileSelector.vue";
import SvgPending from "./svg/Pending.vue";
import Errors from "./partials/Errors.vue";
import ColumnsSorting from "./partials/ColumnsSorting.vue";
import Export from "./partials/Export.vue";
import TimestampSettings from "./partials/TimestampSettings.vue";
import ApiRequest from "./partials/ApiRequest.vue";
import HeadSection from "./partials/HeadSection.vue";
import ParserCsv from "./partials/ParserCSV.vue";
import ParserJson from "./partials/ParserJSON.vue";

export default {
  components: {
    MyNav,
    MySwitch,
    MyTransition,
    Errors,
    MyButton,
    DialogModal,
    PreviewTable,
    SvgPending,
    FileSelector,
    ColumnsSorting,
    Export,
    TimestampSettings,
    HeadSection,
    ParserCsv,
    ParserJson,
    ApiRequest,
  },

  data() {
    return {
      //loading: false,
      readRecords: 0,
      isReset: true,
      message: null,
      filename: null,
      errors: null,
      validData: false,
      dateError: false,
      fromClipboard: false,
      sortedColumns: [],
      renamings: {},
      allFields: [],
      timestampColumn: null,
      timestampSettings: {
        parsingMode: "auto",
        parsingString: "DD MM YYYY hh:mm:ss",
        outputMode: "auto",
        outputString: "YYYY MM DD",
      },
      timestampParsingError: false,
      outputModes: { converted: "Converted", raw: "Original" },
      outputMode: { converted: "Converted" },
      parsedData: null,
      rawCsv: null,
      rawJson: null,
    };
  },

  methods: {
    reset() {
      this.validData = false;
      this.errors = null;
      this.parsedData = null;
      this.filename = null;
      this.fromClipboard = false;
      this.allFields = [];
      this.sortedColumns = [];
      this.renamings = {};
      this.isReset = true;
    },

    receivedRawData(data) {
      this.rawData = data;
    },

    parsingFinished(validData, errors, parsedData, allFields, sortedColumns) {
      this.validData = validData;
      this.errors = errors;
      this.parsedData = parsedData;
      this.allFields = allFields;
      this.sortedColumns = sortedColumns;
      this.isReset = false;

      this.rawCsv = null;
      this.rawJson = null;
    },

    readClipboard() {
      this.reset();
      navigator.clipboard.readText().then((clipText) => {
        if (clipText === null || clipText.length < 100) {
          this.errors = [
            {
              type: "No relevant data",
              message:
                "No relevant data was received from clipboard [received: '" +
                clipText +
                "']. Please try again.",
            },
          ];
          this.isReset = false;
        } else {
          this.fromClipboard = true;
          this.rawCsv = clipText;
        }
      });
    },

    fileSelected(file) {
      if (!file) return;
      this.reset();
      this.filename = file.name;
      this.rawCsv = file;
    },

    timestampSettingsChanged(settings) {
      this.timestampSettings = settings;
    },

    setTimestampParsingError(error) {
      this.timestampParsingError = error;
    },
  },
};
</script>
