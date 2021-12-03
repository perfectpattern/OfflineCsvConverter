<template>
  <div v-show="show">
    <div class="flex justify-between items-center mb-4 border-b pb-2">
      <div class="text-xl mt-10">Sort Columns</div>
    </div>
    <draggable-lists :lists="lists" @update:lists="emit" />
  </div>
</template>

<script>
import DraggableLists from "/src/components/DraggableLists.vue";
import { helpers } from "/src/modules/helpers";

export default {
  components: {
    DraggableLists,
  },

  props: ["columns", "validData"],

  emits: ["update:columns"],

  data() {
    return {
      lists: null,
    };
  },

  watch: {
    columns() {
      //Check columns
      if (
        this.columns === null ||
        !this.columns instanceof Object ||
        Object.keys(this.columns).length == 0
      )
        this.lists = null;
      else this.initializeLists();
    },
  },

  computed: {
    show() {
      return this.columns !== null;
    },
  },

  methods: {
    initializeLists() {
      //Prepare lists
      let tempLists = {
        timestamps: [],
        values: [],
        removals: [],
      };

      //convert to lists to be used in draggable
      let columnsArray = helpers.columnsToSortedArray(this.columns);
      for (var i = 0; i < columnsArray.length; i++) {
        let column = columnsArray[i];
        if (column.tags.includes("timestamp"))
          tempLists.timestamps.push(column);
        else if (column.tags.includes("removal"))
          tempLists.removals.push(column);
        else tempLists.values.push(column);
      }

      this.lists = [
        {
          id: "_timestamps",
          name: "Timestamps",
          list: tempLists.timestamps,
        },
        {
          id: "_values",
          name: "Values",
          list: tempLists.values,
        },
        {
          id: "_removals",
          name: "Removals",
          list: tempLists.removals,
        },
      ];
    },

    emit(lists) {
      let tags = ["timestamp", "value", "removal"];
      let updatedColumns = {};
      let overallOrderIndex = 0;
      lists.forEach((list, index) => {
        let tag = tags[index];
        list.list.forEach((column) => {
          column.tags = this.updateTags(column.tags, tag, tags);
          column.order = overallOrderIndex;
          overallOrderIndex++;
          updatedColumns[column.id] = column;
        });
      });

      //add timestamp column again (since was ignored)
      updatedColumns["timestamp"] = this.columns.timestamp;

      //emit
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