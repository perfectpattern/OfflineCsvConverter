<template>
  <div class="flex justify-between items-center mb-4">
    <!--buttons-->
    <div class="flex justify-between sm:justify-end gap-2">
      <my-button
        :size="'small'"
        class="bg-blue-300"
        :disabled="info.isFirstPage"
        @click="$emit('pageOrder', 'first')"
      >
        <svg-chevron-left-double class="h-4 w-6 stroke-current" />
      </my-button>

      <my-button
        :size="'small'"
        class="bg-blue-300"
        :disabled="info.isFirstPage"
        @click="$emit('pageOrder', 'prev')"
      >
        <svg-chevron-left class="h-4 w-6 stroke-current" />
      </my-button>

      <input
        type="number"
        min="1"
        :max="info.pages"
        :value="info.currentPage"
        @change="$emit('pageOrder', $event.target.value)"
        class="
          border-gray-300
          focus:border-indigo-300
          focus:ring focus:ring-indigo-200 focus:ring-opacity-50
          rounded-md
          shadow-sm
          py-1
        "
      />
      <my-button
        :size="'small'"
        class="bg-blue-300"
        :disabled="info.isLastPage"
        @click="$emit('pageOrder', 'next')"
      >
        <svg-chevron-right class="h-4 w-6 stroke-current" />
      </my-button>

      <my-button
        :size="'small'"
        class="bg-blue-300"
        :disabled="info.isLastPage"
        @click="$emit('pageOrder', 'last')"
      >
        <svg-chevron-right-double class="h-4 w-6 stroke-current" />
      </my-button>
    </div>

    <!--Pagination text-->
    <div class="hidden sm:block">
      <p
        class="text-sm font-normal text-gray-700 uppercase"
        v-if="info.total > 0"
      >
        Showing
        <span class="font-bold">{{ info.from }} </span>
        to
        <span class="font-bold">{{ info.to }}</span>
        of
        <span class="font-bold">{{ info.total }}</span>
        records
      </p>
      <p class="text-sm text-gray-700" v-else>No records</p>
    </div>

    <!--Page length-->
    <div class="flex gap-x-2 items-center">
    <select
      class="
        appearance-none
        block
        w-24
        px-3
        py-1
        border border-gray-300
        rounded-md
        shadow-sm
        placeholder-gray-400
        focus:outline-none
        focus:ring-1 focus:ring-blue-200
        focus:border-blue-200
        sm:text-sm
      "
      :value="info.pageLength"
      @change="$emit('pageLengthChanged', $event.target.value)"
    >
      <option v-for="(record, index) in perPage" :key="index" :value="record">
        {{ record }}
      </option>
    </select>
    per page
    </div>
  </div>
</template>

<script>
import MyButton from "./Button.vue";
import SvgChevronRight from "/src/svg/ChevronRight.vue";
import SvgChevronRightDouble from "/src/svg/ChevronRightDouble.vue";
import SvgChevronLeft from "/src/svg/ChevronLeft.vue";
import SvgChevronLeftDouble from "/src/svg/ChevronLeftDouble.vue";

export default {
  components: {
    MyButton,
    SvgChevronRight,
    SvgChevronRightDouble,
    SvgChevronLeft,
    SvgChevronLeftDouble,
  },

  props: ["info", "perPage"],
};
</script>
