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

  props: {
    columns: {
      default: null,
    },
    validData: {
      default: false,
    },
  },

  data() {
    return {
      lists: null,
      show: false,
    };
  },
  watch: {
    columns: {
      handler(val, oldVal) {
        //Check columns
        if (val === null) {
          this.lists = null;
          this.show = false;
        } else {
          this.initializeLists();
          this.show = true;
        }
      },
      deep: true,
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
        else if (column.tags.includes("value")) tempLists.values.push(column);
        else {
          //IGNORE
        }
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
      let overallOrderIndex = 0;
      lists.forEach((list, index) => {
        let tag = tags[index];
        list.list.forEach((column) => {
          column.tags = this.updateTags(column.tags, tag, tags);
          column.order = overallOrderIndex;
          overallOrderIndex++;
          this.columns[column.id] = column;
        });
      });

      //emit
      this.$emit("update:columns", this.columns);
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