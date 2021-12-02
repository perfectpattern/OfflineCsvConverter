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
      readRecords: 0,
      parsedData: null,
      columns: null,
      progressUpdateEach: 10000,
    };
  },

  watch: {
    input() {
      //Start this parsing modul as soon as input is not null
      if (this.input === null) return;
      this.loading = true;
      this.parse();
    },
  },

  methods: {
    parse() {
      this.errors = null;

      let j = 0;

      //Parsing result is collected in res
      let res = {
        data: [],
        errors: [],
        meta: {},
      };

      this.readRecords = 0;

      //Parse
      papa.parse(this.input, {
        header: true,
        worker: false,
        skipEmptyLines: true,

        //Define step
        step: function (results, parser) {
          //Update progress
          if (j % this.progressUpdateEach == 0) {
            this.readRecords = j;
          }
          //set meta info (only on first step)
          if (j == 0) res.meta = results.meta;

          //push data to res
          res.data.push(results.data);

          //push errors to res
          if (results.errors.length > 0) {
            for (var i = 0; i < results.errors.length; i++) {
              res.errors.push(results.errors[i]);
            }
          }
          j++;
        }.bind(this),

        //Parsing completed
        complete: function (results, file) {
          //Success
          if (
            res.errors.length == 0 &&
            res.hasOwnProperty("data") &&
            res.data.length > 0 &&
            res.hasOwnProperty("meta") &&
            res.meta.hasOwnProperty("fields")
          ) {
            //Set result data
            this.errors = null;
            this.parsedData = res.data;

            //prepare columns
            this.columns = [];
            res.meta.fields.forEach((field, index) => {
              this.columns.push({
                field: field, //used to map with parsed data keys
                name: field, //can be changed
                id: index,
                tags: [],
                order: index + 1,
              });
            });
          }

          //Error
          else {
            this.errors =
              res.errors.length > 0
                ? res.errors
                : [
                    {
                      type: "Data could not be parsed",
                      message:
                        "The received data could not be parsed as CSV by papaparse (https://www.papaparse.com/docs).",
                    },
                  ];
            //limit to 5 error entries
            let errorsLength = this.errors.length;
            if (errorsLength > 5) {
              this.errors = this.errors.slice(0, 4);
              this.errors.push({
                type: "Further errors removed...",
                message: "There are " + (errorsLength - 4) + " more errors.",
              });
            }
            this.parsedData = null;
            this.columns = null;
          }

          //Emit
          this.$emit(
            "parsing-finished",
            this.errors,
            this.parsedData,
            this.columns
          );

          //Finally
          this.loading = false;
        }.bind(this),
      });
    },
  },
};
</script>