<template>
  <draggable-lists
    v-model:lists="lists"
    @update:lists="emitUpdates"
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

  props: [
    "fields",
    "renamings",
    "sortedColumns",
    "timestampColumns",
    "removedColumns",
  ],

  emits: [
    "update:sortedColumns",
    "update:timestampColumns",
    "update:removedColumns",
    "update:renamings",
  ],

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
      //convert to lists to be used in draggable
      if (!Array.isArray(this.fields) || this.fields.length == 0) return;

      let timestampList = [];
      let columnsList = [];
      this.fields.forEach((field, index) => {
        //...field belongs to timestamps list
        if (
          (field.toLowerCase().includes("date") ||
            field.toLowerCase().includes("time")) &&
          timestampList.length == 0
        ) {
          timestampList.push({
            name: field,
            id: helpers.sanitizeString(field),
          });
          this.$emit("update:timestampColumns", field);
        }

        //...field belongs to values list
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

    emitUpdates() {
      [
        "update:timestampColumns",
        "update:sortedColumns",
        "update:removedColumns",
      ].forEach((entry, index) => {
        //convert back
        let updatedList = [];
        this.lists[index].list.forEach((col) => {
          updatedList.push(col.name);
        });
        //emit updated list
        this.$emit(entry, updatedList);
      });
    },
  },
};
</script>