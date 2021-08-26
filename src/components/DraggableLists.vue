<template>
  <div class="flex justify-between gap-x-4">
    <div v-for="listEntry in lists" :key="listEntry.id" class="w-full">
      <!--Title-->
      <h3 class="text-base">
        {{ listEntry.name }} ({{ listEntry.list.length }})
      </h3>

      <!--Draggable-->
      <draggable
        class="
          border-2 border-dashed border-gray-500
          rounded-md
          p-2
          overflow-y-auto overflow-x-hidden
        "
        :class="height"
        tag="transition-group"
        :component-data="{
          tag: 'ul',
          type: 'transition-group',
          name: !drag ? 'flip-list' : null,
        }"
        :list="listEntry.list"
        v-bind="dragOptions"
        @start="drag = true"
        @end="changed"
        item-key="id"
      >
        <template #item="{ element }">
          <div
            class="
              px-4
              py-1.5
              border-b-2 border-white
              cursor-move
              bg-gray-100
              text-xs text-gray-500
              uppercase
              w-full
              flex
              justify-between
              items-center
            "
          >
            <div class="text-sm">
              {{ element.name }}
            </div>
            <svg-move class="h-3 text-gray-500" />
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import SvgMove from "/src/svg/Move.vue";

export default {
  components: {
    draggable,
    SvgMove,
  },

  props: {
    height: {
      default: "h-40",
    },

    initialLists: {
      //Demo data
      default: [
        {
          id: "l1",
          name: "List 1",
          list: [
            { id: 11, name: "Item11" },
            { id: 12, name: "Item12" },
            { id: 13, name: "Item13" },
          ],
        },
        {
          id: "l2",
          name: "List 2",
          list: [
            { id: 21, name: "Item21" },
            { id: 22, name: "Item22" },
            { id: 23, name: "Item23" },
          ],
        },
        {
          id: "l3",
          name: "List 3",
          list: [
            { id: 31, name: "Item31" },
            { id: 32, name: "Item32" },
            { id: 33, name: "Item33" },
          ],
        },
      ],
    },
  },

  data() {
    return {
      lists: this.initialLists,
      drag: false,
      dragOptions: {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      },
    };
  },

  watch: {
    initialLists() {
      this.lists = this.initialLists;
    },
  },

  methods: {
    changed() {
      this.drag = false;
      //Restict timestamp column to one entry
      //this.lists[1].list.push(this.lists[0].list.splice(1));
      this.$emit("changed", this.lists);
    },
  },
};
</script>

<style scoped>
.ghost {
  opacity: 0.3;
}
</style>