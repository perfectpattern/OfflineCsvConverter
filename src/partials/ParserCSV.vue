<template>
  <!--Loading modal-->
  <dialog-modal :show="loading">
    <template #title>Reading...{{ readRecords }}</template>
    <template #content><svg-pending class="h-10" /></template>
  </dialog-modal>
</template>

<script>
import papa from "papaparse";
import DialogModal from "/src/components/jetstream/DialogModal.vue";
import SvgPending from "/src/svg/Pending.vue";

export default {
  components: { DialogModal, SvgPending },

  props: ["input"],

  emits: ["parsing-finished"],

  data() {
    return {
      loading: false,
      errors: null,
      validData: false,
      readRecords: 0,
      parsedData: null,
      allFields: [],
      sortedColumns: [],
    };
  },

  watch: {
    input() {
      if (this.input === null) return;
      this.loading = true;
      this.parse(this.input).then(() => {
        this.$emit(
          "parsing-finished",
          this.validData,
          this.errors,
          this.parsedData,
          this.allFields,
          this.sortedColumns
        );
        this.loading = false;
      });
    },
  },

  methods: {
    parse(input) {
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
                  //console.log(results.errors[i]);
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
                    type: "Data is not csv",
                    message:
                      "The received data could not be parsed as CSV by papaparse (https://www.papaparse.com/docs).",
                  },
                ];
              }
              resolve();
            }.bind(this),
          });
        }.bind(this)
      );
    },
  },
};
</script>