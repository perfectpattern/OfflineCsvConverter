<template>
  <div class="flex justify-between gap-x-4">
    <div v-for="listEntry in listsCopy" :key="listEntry.id" class="w-full">
      <!--Title-->
      <h3 class="text-sm font-semibold mb-1">
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
              w-full
              flex
              justify-between
              items-center
            "
          >
            <!--Editing (renaming) view-->
            <div
              class="flex gap-x-2 items-center"
              v-if="editingId === element.id"
            >
              <svg-check
                class="w-5 cursor-pointer text-blue-300"
                @click="finishEditing"
              />
              <jet-input
                class="border px-2 py-0.5"
                v-model="element.name"
                @keyup.enter="finishEditing"
              />
            </div>

            <!--Default view-->
            <div class="flex gap-x-2 items-center" v-else>
              <svg-pencil
                class="w-4 h-4 cursor-pointer"
                @click="editingId = element.id"
              />
              <div class="text-sm">
                {{ element.name }}
              </div>
            </div>

            <svg-move class="h-3 text-gray-500" />
          </div>
        </template>
      </draggable>
      <div class="text-sm text-gray-500 mt-2" v-show="showExplanations">
        {{ listEntry.description }}
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import SvgMove from "/src/svg/Move.vue";
import SvgPencil from "/src/svg/Pencil.vue";
import SvgCheck from "/src/svg/Check.vue";
import JetInput from "/src/components/jetstream/Input.vue";

export default {
  components: {
    draggable,
    SvgMove,
    SvgPencil,
    SvgCheck,
    JetInput,
  },

  props: {
    height: {
      default: "h-40",
    },

    lists: {
      default: null /*
      //Demo data
      [
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
      ],*/,
    },

    showExplanations: {
      default: false,
    },
  },

  emits: ["update:lists"],

  data() {
    return {
      drag: false,
      dragOptions: {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      },
      editingId: null,
      listsCopy: null,
    };
  },

  watch: {
    lists() {
      if (this.lists === null) this.listsCopy = null;
      else {
        if (JSON.stringify(this.lists) === JSON.stringify(this.listsCopy))
          return; //no changes detected
        this.listsCopy = JSON.parse(JSON.stringify(this.lists));
      }
    },
  },

  methods: {
    changed() {
      this.drag = false;
      this.emit();
    },

    finishEditing() {
      this.editingId = null;
      this.emit();
    },

    emit() {
      this.$emit("update:lists", this.listsCopy);
    },
  },
};
</script>

<style scoped>
.ghost {
  opacity: 0.3;
}
</style>