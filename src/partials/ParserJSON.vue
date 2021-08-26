<template>
  <!--Loading modal-->
  <dialog-modal :show="loading">
    <template #title>Reading...{{ readRecords }}</template>
    <template #content><svg-pending class="h-10" /></template>
  </dialog-modal>
</template>

<script>
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
      sortedColumns: null,
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
    parse: function (json) {
      return new Promise(
        function (resolve, reject) {
          let analysis = this.analyseJSON(json);
          let path = this.chooseJSONpath(analysis);
          let dataNode = this.extractJSONpath(json, path);
          let res = this.readJSONdata(dataNode);

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
            this.allFields = [];
          }
          resolve();
        }.bind(this)
      );
    },

    analyseJSON: function (obj, path = "", analysis = []) {
      let type =
        obj === null
          ? "Null"
          : obj === undefined
          ? "Undefined"
          : Object.prototype.toString.call(obj).slice(8, -1);

      if (type === "Array") {
        analysis.push({
          path: path,
          type: "Array",
          length: obj.length,
        });
      } else if (type === "Object") {
        analysis.push({
          path: path,
          type: "Object",
          length: Object.keys(obj).length,
        });

        if (Object.keys(obj).length < 50) {
          Object.keys(obj).forEach((key) => {
            let newObj = obj[key];
            analysis = this.analyseJSON(
              newObj,
              path + (path === "" ? "" : "/") + key,
              analysis
            );
          });
        }
      }

      //Dead end
      else {
        analysis.push({
          path: path,
          type: type,
          length: null,
        });
      }

      return analysis;
    },

    chooseJSONpath: function (analysis) {
      let minRequiredLength = 50;
      let maxLength = 0;
      let path = null;
      analysis.forEach((entry) => {
        if (entry.length !== null && entry.length > minRequiredLength) {
          if (entry.length > maxLength) {
            maxLength = entry.length;
            path = entry.path;
          }
        }
      });
      return path;
    },

    extractJSONpath: function (json, path) {
      let pathArr = path.split("/");
      let key = pathArr.shift();
      if (key !== "") return this.extractJSONpath(json[key], pathArr.join("/"));
      else return json;
    },

    readJSONdata: function (obj) {
      let type =
        obj === null
          ? "Null"
          : obj === undefined
          ? "Undefined"
          : Object.prototype.toString.call(obj).slice(8, -1);

      let result = {
        data: [],
        errors: [],
        meta: {
          fields: [],
        },
      };

      //Json is an object of records
      if (type === "Object") {
        for (var key in obj) {
          let record = obj[key];
          record["id"] = key;

          //Read record
          let recordRead = this.readRecord(record);

          //Add data record
          result.data.push(recordRead.record);

          //Merge fields
          for (var i = 0; i < recordRead.fields.length; i++) {
            let field = recordRead.fields[i];
            if (!result.meta.fields.includes(field))
              result.meta.fields.push(field);
          }
        }
      }

      //Json is an array of records
      if (type === "Array") {
        for (var i = 0; i < obj.length; i++) {
          let record = obj[i];

          //Read record
          let recordRead = this.readRecord(record);

          //Add data record
          result.data.push(recordRead.record);

          //Merge fields
          for (var j = 0; j < recordRead.fields.length; j++) {
            let field = recordRead.fields[j];
            if (!result.meta.fields.includes(field))
              result.meta.fields.push(field);
          }
        }
      }

      return result;
    },

    readRecord: function (obj, path = "", recordRead = null) {
      //init recordRead
      if (recordRead === null) {
        recordRead = {
          record: {},
          fields: [],
        };
      }

      //Get type of record
      let type =
        obj === null
          ? "Null"
          : obj === undefined
          ? "Undefined"
          : Object.prototype.toString.call(obj).slice(8, -1);

      //Read record or iterate through children
      switch (type) {
        case "Object":
          for (var k = 0; k < Object.keys(obj).length; k++) {
            let key = Object.keys(obj)[k];
            this.readRecord(
              obj[key],
              path + (path === "" ? "" : "/") + key,
              recordRead
            );
          }
          break;

        case "Array":
          for (var k = 0; k < obj.length; k++) {
            this.readRecord(
              obj[k],
              path + (path === "" ? "" : "/") + k,
              recordRead
            );
          }
          break;

        default:
          let field = path.split("/").join("_");
          let value = obj;
          recordRead.record[field] = value;
          recordRead.fields.push(field);
          break;
      }
      return recordRead;
    },
  },
};
</script>