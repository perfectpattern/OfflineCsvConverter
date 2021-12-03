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
            :columns="columns"
            :parsedData="parsedData"
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

      <!--Columns Sorting-->
      <columns-sorting v-model:columns="columns" />

      <!--Timedate parsing-->
      <timestamp-settings
        v-model:columns="columns"
        :parsedData="parsedData"
        :timestampParsingError="timestampParsingError"
      />

      <!--Rule-->
      <rule
        v-if="columns !== null"
        :id="'tset'"
        v-model:columns="columns"
        :parsedData="parsedData"
      />

      <!--Output Data Preview-->
      <preview-table
        :parsedData="parsedData"
        :columns="columns"
        @timestampParsingError="setTimestampParsingError"
      />
    </div>

    <!--CSV Parser-->
    <parser-csv :input="rawCsv" @parsing-finished="parsingFinished" />
  </div>
</template>

<script>
import { dataPreparator } from "/src/modules/dataPreparator";

import DialogModal from "./components/jetstream/DialogModal.vue";
import MyNav from "./components/Nav.vue";
import MySwitch from "./components/SwitchSmall.vue";
import MyTransition from "./components/Transition.vue";
import MyButton from "./components/Button.vue";
import PreviewTable from "./partials/PreviewTable.vue";
import Rule from "./partials/Rule.vue";
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
    Rule,
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
      columns: null,
      rules: {},
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
      this.columns = null;
    },

    //Entry point for parsed data
    parsingFinished(parsingResult) {
      //prepare the parse data
      let response = dataPreparator.prepare(parsingResult);
      console.log("response", response);
      this.errors = response.errors;
      this.parsedData = response.parsedData;
      this.columns = response.columns;
      this.rawCsv = null;
      this.validData = response.errors === null;
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
