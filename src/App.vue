<template>
  <div
    class="
      max-w-6xl
      mx-auto
      bg-gray-50 bg-opacity-50
      border-l border-r
      min-h-screen
      pb-6
    "
  >
    <!--Head Section-->
    <head-section />

    <!--Main buttons-->
    <div class="p-6 flex justify-between" v-show="filename !== null">
      <!--Reset-->
      <my-button
        :icon="'reload'"
        :disabled="isReset"
        :color="'red-full'"
        @click="reset"
        >Reset</my-button
      >

      <!--Export-->
      <export
        :columns="columns"
        :parsedData="parsedData"
        :filename="filename"
      />
    </div>

    <!--Viewing options-->
    <div
      class="px-6 flex justify-end gap-x-2 text-sm text-blue-300 font-semibold"
      v-show="filename !== null && errors === null"
    >
      Explanations:
      <my-switch :options="explanationModes" v-model="hideExplanations" />
    </div>

    <!--Filename-->
    <div class="p-6">
      <div
        v-show="filename !== null"
        class="
          text-3xl
          mb-8
          flex
          justify-center
          text-gray-500
          gap-x-2
          items-center
        "
      >
        <svg-document class="h-10 w-10" />
        <div>
          {{
            filename !== null
              ? filename
              : fromClipboard
              ? "Copied from clipboard"
              : "No CSV data yet"
          }}
        </div>
      </div>

      <!--File input local-->
      <my-transition>
        <file-selector
          v-show="!validData && errors === null"
          :accept="'.json, .csv, application/json, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'"
          :filename="filename"
          @file-selected="fileSelected"
          @read-clipboard="readClipboard"
        />
      </my-transition>

      <!--Errors-->
      <errors :errors="errors" />

      <!--Columns Sorting-->
      <columns-sorting
        v-model:columns="columns"
        :showExplanations="hideExplanations.id === 'show'"
      >
        <template #title-complement>
          <!--Create rule-->
          <my-button :icon="'add'" @click="createRule"> Add column </my-button>
        </template></columns-sorting
      >

      <!--Rules-->
      <div v-if="columns !== null">
        <rule
          v-for="rule in rules"
          :key="rule"
          :id="rule"
          v-model:columns="columns"
          :parsedData="parsedData"
          :showExplanations="hideExplanations.id === 'show'"
          @remove-rule="removeRule"
        />
      </div>

      <!--Timedate parsing-->
      <timestamp-settings
        v-model:columns="columns"
        :parsedData="parsedData"
        :showExplanations="hideExplanations.id === 'show'"
        :timestampParsingError="timestampParsingError"
      />

      <!--Output Data Preview-->
      <div v-if="columns !== null">
        <preview-table
          :parsedData="parsedData"
          :showExplanations="hideExplanations.id === 'show'"
          :columns="columns"
          @timestampParsingError="setTimestampParsingError"
        />
      </div>
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
import SvgDocument from "/src/svg/document.vue";

export default {
  components: {
    DialogModal,
    MyNav,
    MySwitch,
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
    SvgDocument,
  },

  data() {
    return {
      explanationModes: [
        { id: "show", label: "show" },
        { id: "hide", label: "hide" },
      ],
      hideExplanations: { id: "show", label: "show" },
      message: null,
      filename: null,
      errors: null,
      rules: [],
      validData: false,
      fromClipboard: false,
      columns: null,
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
      isReset: true,
    };
  },

  watch: {
    columns: {
      handler(val, oldVal) {
        //console.log("Change in columns detected");
      },
      deep: true,
    },
  },

  methods: {
    createRule() {
      let id = "rule_" + (this.rules.length + 1);
      this.rules.push(id);
    },

    removeRule(id) {
      var index = this.rules.indexOf(id);
      if (index !== -1) {
        this.rules.splice(index, 1);
      }
      delete this.columns[id];
    },

    reset() {
      this.validData = false;
      this.errors = null;
      this.parsedData = null;
      this.filename = null;
      this.fromClipboard = false;
      this.columns = null;
      this.rules = [];
      this.isReset = true;
    },

    //Entry point for parsed data
    parsingFinished(parsingResult) {
      //prepare the parse data
      let response = dataPreparator.prepare(parsingResult);
      //console.log("response", response);
      this.errors = response.errors;
      this.parsedData = response.parsedData;
      this.columns = response.columns;
      this.rawCsv = null;
      this.validData = response.errors === null;
      this.isReset = false;
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
