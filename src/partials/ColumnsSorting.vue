<template>
  <draggable-lists
    :initialLists="lists"
    @changed="changed"
    :renamings="renamings"
    @update:renamings="$emit('update:renamings', $event)"
  />
</template>

<script>
import DraggableLists from "/src/components/DraggableLists.vue";
import { helpers } from "/src/modules/helpers";

export default {
  components: {
    DraggableLists,
  },

  props: ["fields", "renamings", "sortedColumns", "timestampColumn"],

  emits: ["update:sortedColumns", "update:timestampColumn", "update:renamings"],

  data() {
    return {
      lists: [],
    };
  },

  watch: {
    fields() {
      this.initializeLists();
    },
  },

  methods: {
    initializeLists() {
      if (!Array.isArray(this.fields) || this.fields.length == 0) return;

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

    changed(lists) {
      let updatedSortedColumns = [];
      let updatedTimestampColumn =
        lists[0].list.length > 0 ? lists[0].list[0].name : null;

      //Add timestamp column
      if (updatedTimestampColumn !== null)
        updatedSortedColumns.push(updatedTimestampColumn);

      //Add sorted columns
      lists[1].list.forEach((col) => {
        updatedSortedColumns.push(col.name);
      });

      this.$emit("update:sortedColumns", updatedSortedColumns);
      this.$emit("update:timestampColumn", updatedTimestampColumn);
    },
  },
};
</script>