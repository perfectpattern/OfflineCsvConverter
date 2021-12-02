<template>
  <draggable-lists :lists="lists" @update:lists="emit" />
</template>

<script>
import DraggableLists from "/src/components/DraggableLists.vue";

export default {
  components: {
    DraggableLists,
  },

  props: ["columns"],

  emits: ["update:columns"],

  data() {
    return {
      lists: null,
    };
  },

  watch: {
    columns() {
      //Check columns
      if (!Array.isArray(this.columns) || this.columns.length == 0)
        this.lists = null;
      else this.initializeLists();
    },
  },

  methods: {
    initializeLists() {
      //Prepare lists
      let listTimestamps = [];
      let listValues = [];
      let listRemovals = [];

      //convert to lists to be used in draggable
      this.columns.forEach((column, index) => {
        if (column.tags.includes("timestamp")) listTimestamps.push(column);
        else if (column.tags.includes("removal")) listRemovals.push(column);
        else listValues.push(column);
      });

      this.lists = [
        {
          id: "_timestamps",
          name: "Timestamps",
          list: listTimestamps,
        },
        {
          id: "_values",
          name: "Values",
          list: listValues,
        },
        {
          id: "_removals",
          name: "Removals",
          list: listRemovals,
        },
      ];
    },

    emit(lists) {
      //console.log("lists", lists);
      let tags = ["timestamp", "value", "removal"];
      let updatedColumns = [];
      lists.forEach((list, index) => {
        let tag = tags[index];
        list.list.forEach((column) => {
          column.tags = this.updateTags(column.tags, tag, tags);
          updatedColumns.push(column);
        });
      });
      this.$emit("update:columns", updatedColumns);
    },

    updateTags(target, newTag, removes) {
      //Push 'new' if not existing
      if (!target.includes(newTag)) target.push(newTag);
      let targetNew = [];
      target.forEach((tag) => {
        if (tag === newTag) targetNew.push(tag);
        else if (!removes.includes(tag)) targetNew.push(tag);
      });
      return targetNew;
    },
  },
};
</script>