<template>
  <div class="max-w-6xl mx-auto bg-gray-50 bg-opacity-50 border-l border-r min-h-screen">
    <!--Head Section-->
    <head-section></head-section>

    <!--Switch for datatype-->
    <div class="flex justify-center mt-8">
      <my-switch v-model="dataType" :data="dataTypes" />
    </div>

    <div class="p-6">
      <div class="text-2xl flex justify-between">
        <div>Input {{ dataType === "csv" ? "CSV" : "JSON" }}</div>
        <my-button @click="reset" class="bg-red-500">Reset</my-button>
      </div>

      <!--Tabs Navigation-->
      <my-nav v-model="currentTab" :tabs="tabs" class="mb-4"> </my-nav>

      <!--File input local-->
      <div v-show="currentTab === 'local'">
        <file-selector
          :accept="'.json, .csv, application/json, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'"
          @file-selected="fileSelected"
          @read-clipboard="readClipboard"
        ></file-selector>
      </div>

      <!--File input api-->
      <div v-show="currentTab === 'api'">
        <api-request @dataReceived="apiDataReceived" />
      </div>

      <!--Errors-->
      <errors :errors="errors" />

      <!--Columns Sorting-->
      <div v-show="validData">
        <div class="flex justify-between items-center mb-4 border-b pb-2">
          <div class="text-xl mt-8">Sort Columns</div>
        </div>
        <columns-sorting
          :fields="allFields"
          @update:sortedColumns="updateSortedColumns"
          @update:timestampColumn="updateTimestampColumn"
        />
      </div>

      <!--Timedate parsing-->
      <div v-show="validData && timestampColumn !== null">
        <div class="flex justify-between items-center mb-4 border-b pb-2">
          <div class="text-xl mt-8">Timestamp Settings</div>
        </div>
        <timestamp-settings
          @changed="timestampSettingsChanged"
          :timestampParsingError="timestampParsingError"
        />
      </div>

      <!--Output Data Preview-->
      <div v-show="validData">
        <div class="flex justify-between items-center mt-10 mb-4 border-b pb-2">
          <div class="text-xl">Output Data Preview</div>
          <export
            :timestampColumn="timestampColumn"
            :sortedColumns="sortedColumns"
            :data="parsedData == null ? [] : parsedData.data"
            :timestampSettings="timestampSettings"
          />
        </div>
        <my-table
          :parsedData="parsedData"
          :validData="validData"
          :fields="sortedColumns"
          :timestampColumn="timestampColumn"
          :timestampSettings="timestampSettings"
          @timestampParsingError="setTimestampParsingError"
        />
      </div>

      <!--Loading modal-->
      <dialog-modal :show="loading">
        <template #title>Reading...{{ readRecords }}</template>
        <template #content><svg-pending class="h-10" /></template>
      </dialog-modal>
    </div>
  </div>
</template>

<script>
import papa from "papaparse";
import DialogModal from "./components/jetstream/DialogModal.vue";
import MyNav from "./components/Nav.vue";

import MySwitch from "./components/SwitchSmall.vue";
import MyButton from "./components/Button.vue";
import MyTable from "./components/Table.vue";
import FileSelector from "./components/FileSelector.vue";
import SvgPending from "./svg/Pending.vue";
import Errors from "./partials/Errors.vue";
import ColumnsSorting from "./partials/ColumnsSorting.vue";
import Export from "./partials/Export.vue";
import TimestampSettings from "./partials/TimestampSettings.vue";
import ApiRequest from "./partials/ApiRequest.vue";
import HeadSection from "./partials/HeadSection.vue";

import { jsonParser } from "/src/modules/jsonParser";

export default {
  components: {
    MyNav,
    MySwitch,
    Errors,
    MyButton,
    DialogModal,
    MyTable,
    SvgPending,
    FileSelector,
    ColumnsSorting,
    Export,
    TimestampSettings,
    HeadSection,
    ApiRequest,
  },

  data() {
    return {
      loading: false,
      readRecords: 0,
      message: null,
      errors: null,
      validData: false,
      dateError: false,
      sortedColumns: [],
      allFields: [],
      timestampColumn: null,
      timestampSettings: {
        parsingMode: "auto",
        parsingString: "DD MM YYYY hh:mm:ss",
        outputMode: "auto",
        outputString: "YYYY MM DD",
      },
      timestampParsingError: false,
      currentTab: "local",
      dataType: "csv",
      dataTypes: { csv: "CSV TO CSV", json: "JSON TO CSV" },
      tabs: [
        { key: "local", name: "From Local" },
        { key: "api", name: "From API" },
      ],
      parsedData: null,
    };
  },

  methods: {
    reset() {
      this.parsedData = null;
    },

    changeTab(key) {
      this.currentTab = key;
    },

    changeDatatype(key) {
      this.dataType = key;
    },

    receivedRawData(data) {
      this.rawData = data;
    },

    processRawData(input) {
      this.errors = null;
      this.validData = false;

      return new Promise(
        function (resolve, reject) {
          let j = 0;

          let res = {
            data: [],
            errors: [],
            meta: {},
          };

          this.readRecords = 0;

          papa.parse(input, {
            header: true,
            worker: false,
            skipEmptyLines: true,

            step: function (results, parser) {
              if (j % 10000 == 0) {
                this.readRecords = j;
              }
              if (j == 0) res.meta = results.meta;
              res.data.push(results.data);
              if (results.errors.length > 0) {
                for (var i = 0; i < results.errors.length; i++) {
                  res.errors.push(results.errors[i]);
                  console.log(results.errors[i]);
                }
              }
              //res.errors = results.errors;
              j++;
            }.bind(this),

            complete: function (results, file) {
              //Success
              if (
                res.errors.length == 0 &&
                res.hasOwnProperty("data") &&
                res.data.length > 0 &&
                res.hasOwnProperty("meta") &&
                res.meta.hasOwnProperty("fields")
              ) {
                this.errors = null;
                this.validData = true;
                this.parsedData = res;
                this.allFields = res.meta.fields;
                this.sortedColumns = res.meta.fields;
              }

              //Error
              else {
                this.errors = res.errors;
                this.validData = false;
                this.parsedData = null;
                this.sortedColumns = [];
              }

              //Finally
              if (this.parsedData === null) {
                this.errors = [
                  {
                    row: 0,
                    type: "Data is not csv",
                    message:
                      "The received data could not be parsed as CSV by papaparse (https://www.papaparse.com/docs).",
                  },
                ];
              }
              this.loading = false;
              resolve();
            }.bind(this),
          });
        }.bind(this)
      );
    },

    readClipboard() {
      this.loading = true;
      navigator.clipboard.readText().then((clipText) => {
        if (clipText === null || clipText.length < 100) {
          this.errors = [
            {
              row: 0,
              type: "No relevant data",
              message:
                "No relevant data was received from clipboard [received: '" +
                clipText +
                "']. Please try again.",
            },
          ];
          this.loading = false;
        } else {
          this.processRawData(clipText);
        }
      });
    },

    fileSelected(file) {
      if (!file) return;
      this.loading = true;
      this.processRawData(file);
    },

    updateSortedColumns(sortedColumns) {
      this.sortedColumns = sortedColumns;
    },

    updateTimestampColumn(timestampColumn) {
      this.timestampColumn = timestampColumn;
    },

    timestampSettingsChanged(settings) {
      this.timestampSettings = settings;
    },

    setTimestampParsingError(error) {
      this.timestampParsingError = error;
    },

    apiDataReceived(json) {
      let res = jsonParser.parse(json);

      //Success
      if (res.errors.length == 0) {
        this.errors = null;
        this.validData = true;

        this.parsedData = res;
        this.allFields = res.meta.fields;
        this.sortedColumns = res.meta.fields;
      }

      //Error
      else {
        this.errors = res.errors;
        this.validData = false;
        this.parsedData = null;
        this.sortedColumns = [];
      }
    },
  },
};
</script>
