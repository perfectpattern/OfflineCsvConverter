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
      let parsingResult = {
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
          if (j == 0) parsingResult.meta = results.meta;

          //push data to res
          parsingResult.data.push(results.data);

          //push errors to res
          if (results.errors.length > 0) {
            for (var i = 0; i < results.errors.length; i++) {
              parsingResult.errors.push(results.errors[i]);
            }
          }
          j++;
        }.bind(this),

        //Parsing completed
        complete: function (results, file) {
          //Emit
          this.$emit("parsing-finished", parsingResult);

          //Finally
          this.loading = false;
        }.bind(this),
      });
    },
  },
};
</script>