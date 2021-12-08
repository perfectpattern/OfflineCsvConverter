<template>
  <my-button
    :disabled="disabled"
    :icon="'download'"
    :color="'blue-full'"
    @click="exportData"
    >CONVERT & DOWNLOAD</my-button
  >

  <!--Exporting modal-->
  <dialog-modal :show="running">
    <template #title>
      <div v-if="!preparingDownload">
        Processed {{ rows }} rows ({{ percent }} percent)
      </div>
      <div v-else>Done. File preparation...</div>
    </template>
    <template #content><svg-pending class="h-10" /></template>
  </dialog-modal>
</template>

<script>
import MyButton from "/src/components/Button.vue";
import DialogModal from "/src/components/jetstream/DialogModal.vue";
import SvgPending from "/src/svg/Pending.vue";
import { helpers } from "/src/modules/helpers";
import { formatter } from "/src/modules/formatter";

export default {
  components: {
    MyButton,
    DialogModal,
    SvgPending,
  },

  props: {
    columns: { default: null },
    parsedData: { default: null },
    filename: {
      default: "name",
    },
  },
  data() {
    return {
      disabled: true,
      rows: 0,
      percent: 0,
      columnsToShow: [],
      running: false,
      preparingDownload: false,
      separator: ",",
      lineEnd: "\n",
    };
  },
  watch: {
    columns: {
      handler(val, oldVal) {
        if (val === null) {
          this.disabled = true;
          this.columnsToShow = [];
        } else {
          this.disabled = false;
          this.show = true;
          this.columnsToShow = helpers.getOutputColumnsArray(val);
        }
      },
      deep: true,
    },
  },

  methods: {
    format(field, value) {
      //prepare options
      let options = {
        isTimestamp: field === this.timestampColumns,
        timestampSettings: this.timestampSettings,
      };

      //format value
      let formatted = formatter.format(value, options);

      //Error
      if (formatted.error) {
        return value;
      }

      //Success
      return formatted.value;
    },

    exportData() {
      this.rows = 0;
      this.percent = 0;
      this.running = true;

      this.convertRecursively(
        this.parsedData,
        this.sortedColumns,
        this.renamings,
        function (csvString) {
          this.download(csvString);
          this.preparingDownload = true;
          setTimeout(
            function () {
              this.running = false;
              this.preparingDownload = false;
            }.bind(this),
            1500
          );
        }.bind(this)
      );
    },

    createCsvHeader() {
      let arr = [];
      if (this.columns.timestamp.fields.length > 0) arr.push("timestamp");
      for (var k = 0; k < this.columnsToShow.length; k++)
        arr.push(this.columnsToShow[k].name);
      return arr.join(this.separator) + this.lineEnd;
    },

    createCsvRow(parsedDataRow) {
      let arr = [];
      for (var j = 0; j < this.columnsToShow.length; j++) {
        let formatted = formatter.format(parsedDataRow, this.columnsToShow[j]);
        arr.push(formatted.formatted);
      }
      return arr.join(this.separator) + this.lineEnd;
    },

    convertRecursively(
      parsedData,
      sortedColumns,
      renamings,
      callback,
      csvString = null,
      index = 0
    ) {
      //Create header
      if (csvString === null) csvString = this.createCsvHeader();

      //Add record
      csvString += this.createCsvRow(parsedData[index]);

      index = index + 1;

      //Call again
      if (index < parsedData.length) {
        //UI update
        if (index % 1000 == 0) {
          this.rows = index;
          this.percent = ((index / parsedData.length) * 100).toFixed(1);

          //call again with time out
          setTimeout(
            function () {
              this.convertRecursively(
                parsedData,
                sortedColumns,
                renamings,
                callback,
                csvString,
                index
              );
            }.bind(this),
            1
          );
        }

        //call again without time out
        else {
          this.convertRecursively(
            parsedData,
            sortedColumns,
            renamings,
            callback,
            csvString,
            index
          );
        }
      } else {
        callback(csvString);
      }
    },

    download(content) {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(content)
      );
      element.setAttribute("download", this.filename || "dataset.csv");

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
  },
};
</script>