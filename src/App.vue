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
          <!--Reset-->
          <my-button @click="reset" class="bg-red-500">Restart</my-button>

          <!--Export-->
          <export
            :timestampColumns="timestampColumns"
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
        />
      </my-transition>

      <!--Errors-->
      <errors :errors="errors" />

      <!--If valid data-->
      <div v-show="validData">
        <div>
          <div class="flex justify-between items-center mb-4 border-b pb-2">
            <div class="text-xl mt-10">Sort Columns</div>
          </div>

          <!--Columns Sorting-->
          <columns-sorting v-model:columns="columns" />
        </div>

        <!--Timedate parsing-->
        <div v-show="timestampColumns.length > 0">
          <div class="flex justify-between items-center mb-4 border-b pb-2">
            <div class="text-xl mt-10">Timestamp Settings</div>
          </div>
          <timestamp-settings
            v-model:timestampSettings="timestampSettings"
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
          <!--Preview table-->
          <!--<preview-table
            :parsedData="parsedData"
            :validData="validData"
            :fields="sortedColumns"
            :renamings="renamings"
            :timestampColumns="timestampColumns"
            :timestampSettings="timestampSettings"
            @timestampParsingError="setTimestampParsingError"
          />-->
        </div>
      </div>

      <!--CSV Parser-->
      <parser-csv :input="rawCsv" @parsing-finished="parsingFinished" />
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
import HeadSection from "./partials/HeadSection.vue";
import ParserCsv from "./partials/ParserCSV.vue";

export default {
  components: {
    DialogModal,
    MyNav,
    MySwitch,
    MyTransition,
    MyButton,
    PreviewTable,
    SvgPending,
    Errors,
    FileSelector,
    ColumnsSorting,
    Export,
    TimestampSettings,
    HeadSection,
    ParserCsv,
  },

  data() {
    return {
      message: null,
      filename: null,
      errors: null,
      validData: false,
      fromClipboard: false,
      sortedColumns: [],
      removedColumns: [],
      renamings: {},
      columns: [],
      timestampColumns: [],
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
    };
  },

  methods: {
    reset() {
      this.validData = false;
      this.errors = null;
      this.parsedData = null;
      this.filename = null;
      this.fromClipboard = false;
      this.columns = [];
      this.sortedColumns = [];
      this.renamings = {};
    },

    receivedRawData(data) {
      this.rawData = data;
    },

    //Entry point for parsed data
    parsingFinished(errors, parsedData, columns) {
      this.errors = errors;
      this.parsedData = parsedData;
      this.columns = columns;
      console.log(this.columns);

      this.rawCsv = null;
      this.validData = errors === null;
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

    setTimestampParsingError(error) {
      this.timestampParsingError = error;
    },
  },
};
</script>
