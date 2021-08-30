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
    <head-section></head-section>

    <!--Switch for datatype-->
    <div class="flex justify-center mt-8">
      <my-switch
        v-model="dataType"
        :data="dataTypes"
        @update:modelValue="reset()"
      />
    </div>

    <div class="p-6">
      <div class="text-2xl flex justify-between">
        <div>Input {{ dataType === "csv" ? "CSV" : "JSON" }}</div>
        <my-button @click="reset" class="bg-red-500">Reset</my-button>
      </div>

      <!--Tabs Navigation-->
      <my-nav
        v-model="currentTab"
        @update:modelValue="reset()"
        :tabs="tabs"
        :disabled="false"
        class="mb-4"
      >
      </my-nav>

      <!--File input local-->
      <div v-show="currentTab === 'local'">
        <file-selector
          :accept="'.json, .csv, application/json, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'"
          :filename="filename"
          @file-selected="fileSelected"
          @read-clipboard="readClipboard"
        ></file-selector>
      </div>

      <!--File input api-->
      <div v-show="currentTab === 'api'">
        <api-request
          @data-received="apiDataReceived"
          @request-error="requestError"
        />
      </div>

      <!--Errors-->
      <errors :errors="errors" />

      <!--Columns Sorting-->
      <div v-show="validData">
        <div class="flex justify-between items-center mb-4 border-b pb-2">
          <div class="text-xl mt-10">Sort Columns</div>
        </div>
        <columns-sorting
          :fields="allFields"
          :renamings="renamings"
          @update:sortedColumns="updateSortedColumns"
          @update:timestampColumn="updateTimestampColumn"
          @updated-renamings="updateRenamings"
        />
      </div>

      <!--Timedate parsing-->
      <div v-show="validData && timestampColumn !== null">
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
        <div class="flex justify-between items-center mt-10 mb-4 border-b pb-2">
          <div class="text-xl">Output Preview</div>
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
        <my-table
          :parsedData="parsedData"
          :validData="validData"
          :fields="sortedColumns"
          :renamings="renamings"
          :timestampColumn="timestampColumn"
          :timestampSettings="timestampSettings"
          @timestampParsingError="setTimestampParsingError"
        />
      </div>

      <!--Loading modal-->
      <!--<dialog-modal :show="loading">
        <template #title>Reading...{{ readRecords }}</template>
        <template #content><svg-pending class="h-10" /></template>
      </dialog-modal>-->

      <parser-csv :input="rawCsv" @parsing-finished="parsingFinished" />
      <parser-json :input="rawJson" @parsing-finished="parsingFinished" />
    </div>
  </div>
</template>

<script>
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
import ParserCsv from "./partials/ParserCSV.vue";
import ParserJson from "./partials/ParserJSON.vue";

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
      currentTab: "local",
      dataType: "csv",
      dataTypes: { csv: "CSV TO CSV", json: "JSON TO CSV" },
      tabs: [
        { key: "local", name: "From Local" },
        { key: "api", name: "From API" },
      ],
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
      this.allFields = [];
      this.sortedColumns = [];
      this.renamings = {};
      if (this.currentTab === "api") this.dataType = "json";
      this.isReset = true;
    },

    receivedRawData(data) {
      this.rawData = data;
    },

    parsingFinished(validData, errors, parsedData, allFields, sortedColumns) {
      this.validData = validData;
      this.errors = errors;
      this.parsedData = parsedData;
      //console.log(parsedData);
      //console.log(allFields);
      //console.log(sortedColumns);
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
          if (this.dataType === "csv") this.rawCsv = clipText;
          if (this.dataType === "json") {
            try {
              let a = JSON.parse(clipText);
              this.rawJson = a;
            } catch (e) {
              this.errors = [
                {
                  type: "Not parsable",
                  message:
                    "The clipboard content could not be parsed as json. Please check console.",
                },
              ];
              console.log(e);
            }
          }
        }
      });
    },

    fileSelected(file) {
      if (!file) return;
      this.reset();
      this.filename = file.name;

      //CSV: Papaparse streams the file
      if (this.dataType === "csv") {
        this.rawCsv = file;
      }

      //JSON: Read the file and parse as string
      if (this.dataType === "json") {
        const reader = new FileReader();
        reader.onload = (res) => {
          try {
            let a = JSON.parse(res.target.result);
            this.rawJson = a;
          } catch (e) {
            this.errors = [
              {
                type: "Not parsable",
                message:
                  "The file could not be parsed as json. Please check console.",
              },
            ];
            console.log(e);
          }
        };
        reader.onerror = (err) => {
          this.errors = [
            {
              type: "Not readable",
              message: "The file could not be read. Please check console.",
            },
          ];
          console.log(err);
        };
        reader.readAsText(file);
      }
    },

    updateSortedColumns(sortedColumns) {
      this.sortedColumns = sortedColumns;
    },

    updateTimestampColumn(timestampColumn) {
      this.timestampColumn = timestampColumn;
    },

    updateRenamings(renamings) {
      console.log("Updated renamings: ");
      console.log(renamings);
      this.renamings = renamings;
    },

    timestampSettingsChanged(settings) {
      this.timestampSettings = settings;
    },

    setTimestampParsingError(error) {
      this.timestampParsingError = error;
    },

    apiDataReceived(data) {
      this.reset();
      if (this.dataType === "csv") this.rawCsv = data;
      if (this.dataType === "json") {
        this.rawJson = data;
        console.log("Received API data:");
        console.log(data);
      }
    },

    requestError(error) {
      this.reset();
      this.errors = [
        {
          type: "Request error",
          message: JSON.stringify(error),
        },
      ];
    },
  },
};
</script>
