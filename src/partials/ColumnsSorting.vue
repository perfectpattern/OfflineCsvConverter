<template>
  <div v-show="show">
    <section-title :hideIntro="!showExplanations">
      Columns
      <template #complement> <slot name="title-complement"></slot></template>
      <template #intro>
        Distribute the columns among the three categories and change their
        order.</template
      >
    </section-title>

    <draggable-lists
      :lists="lists"
      @update:lists="emit"
      :showExplanations="showExplanations"
    />
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
    showExplanations: {
      default: true,
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
            "Columns with time or date information that should be parsed. For parsing, the order is relevant.",
          list: tempLists.timestamps,
        },
        {
          id: "_values",
          name: "Values",
          description:
            "Columns containing values. Order and names can be changed.",
          list: tempLists.values,
        },
        {
          id: "_removals",
          name: "Removals",
          description: "Columns to be removed.",
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