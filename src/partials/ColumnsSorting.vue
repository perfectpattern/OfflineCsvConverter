<template>
  <draggable-lists
    :initialLists="lists"
    @changed="changed"
    :renamings="renamings"
    @updated-renamings="updatedRenamings"
  />
</template>

<script>
import DraggableLists from "/src/components/DraggableLists.vue";
import { helpers } from "/src/modules/helpers";

export default {
  components: {
    DraggableLists,
  },

  props: ["fields", "renamings"],

  emits: [
    "update:sortedColumns",
    "update:timestampColumn",
    "updated-renamings",
  ],

  data() {
    return {
      lists: [],
    };
  },

  watch: {
    fields() {
      if (this.fields.length == 0) return;

      let timestampList = [];
      let columnsList = [];
      this.fields.forEach((field, index) => {
        //Timestamp list
        if (
          (field.toLowerCase().includes("date") ||
            field.toLowerCase().includes("time")) &&
          timestampList.length == 0
        ) {
          timestampList.push({
            name: field,
            id: helpers.sanitizeString(field),
          });
          this.$emit("update:timestampColumn", field);
        }

        //Columns list
        else {
          columnsList.push({
            name: field,
            id: helpers.sanitizeString(field),
          });
        }
      });

      this.lists = [
        {
          id: "timestamp",
          name: "Timestamp",
          list: timestampList,
        },
        {
          id: "sorted",
          name: "Data Columns",
          list: columnsList,
        },
        {
          id: "removals",
          name: "Removals",
          list: [],
        },
      ];
    },
  },

  methods: {
    changed(lists) {
      let sortedColumns = [];
      let timestampColumn =
        lists[0].list.length > 0 ? lists[0].list[0].name : null;

      //Add timestamp column
      if (timestampColumn !== null) sortedColumns.push(timestampColumn);

      //Add sorted columns
      lists[1].list.forEach((col) => {
        sortedColumns.push(col.name);
      });

      this.$emit("update:sortedColumns", sortedColumns);
      this.$emit("update:timestampColumn", timestampColumn);
    },

    updatedRenamings(renamings) {
      this.$emit("updated-renamings", renamings);
    },
  },
};
</script>