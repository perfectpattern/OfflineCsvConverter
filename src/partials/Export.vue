<template>
  <my-button :color="'blue'" @click="exportData">Export</my-button>

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

export default {
  components: {
    MyButton,
    DialogModal,
    SvgPending,
  },

  props: ["timestampColumn", "sortedColumns", "data", "timestampSettings"],

  data() {
    return {
      rows: 0,
      percent: 0,
      running: false,
      preparingDownload: false,
    };
  },

  methods: {
    format(field, value) {
      if (field === this.timestampColumn) {
        let date = helpers.parseDateString(value, this.timestampSettings);
        if (date !== null) return date;
      }
      return value;
    },

    convertRecursively(
      data,
      sortedColumns,
      callback,
      csvString = null,
      index = 0
    ) {
      //Header
      if (csvString === null) csvString = sortedColumns.join(",") + "\n";

      //Add record
      let record = data[index];
      let row = [];
      for (var j = 0; j < sortedColumns.length; j++) {
        let field = sortedColumns[j];
        row.push(this.format(field, record[field]));
      }
      csvString += row.join(",") + "\n";

      index = index + 1;

      //Call again
      if (index < data.length) {
        //UI update
        if (index % 1000 == 0) {
          this.rows = index;
          this.percent = ((index / data.length) * 100).toFixed(1);

          //call again with time out
          setTimeout(
            function () {
              this.convertRecursively(
                data,
                sortedColumns,
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
            data,
            sortedColumns,
            callback,
            csvString,
            index
          );
        }
      } else {
        callback(csvString);
      }
    },

    exportData() {
      this.rows = 0;
      this.percent = 0;
      this.running = true;

      this.convertRecursively(
        this.data,
        this.sortedColumns,
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

    download(content) {
      let filename = "file.csv";
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(content)
      );
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
  },
};
</script>