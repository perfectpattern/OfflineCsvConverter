<template>
  <div v-show="show">
    <section-title
      >Sort Columns
      <template #intro>
        Distribute the columns among the three categories 'Time / Date',
        'Values' and 'Removals' and change their order.</template
      >
    </section-title>

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
          name: "Time / Date",
          description:
            "Move columns with time or date information here. For parsing, their order is relevant.",
          list: tempLists.timestamps,
        },
        {
          id: "_values",
          name: "Values",
          description:
            "Columns containing values that should be kept, remain here. Order and names can be changed.",
          list: tempLists.values,
        },
        {
          id: "_removals",
          name: "Removals",
          description: "Move columns to be removed here.",
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