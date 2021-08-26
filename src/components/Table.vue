<template>
  <div v-if="validData" class="overflow-x-auto">
    <!--Pagination-->
    <pagination
      class="flex-shrink-0 rounded"
      :info="filteredData.info"
      :perPage="perPage"
      @pageOrder="currentPageOrder"
      @pageLengthChanged="pageLengthChange"
    >
    </pagination>

    <!--Table-->
    <table class="min-w-full divide-y divide-gray-200">
      <!--------------------HEADER--------------------->
      <thead class="bg-gray-100">
        <tr class="">
          <th
            class="
              px-4
              py-2
              pt-3
              text-left text-xs
              font-bold
              text-gray-900
              uppercase
              tracking-wider
            "
          >
            #
          </th>
          <th
            v-for="(field, columnIndex) in fields"
            :key="columnIndex"
            scope="col"
            class="
              px-4
              py-2
              pt-3
              text-left text-xs
              font-medium
              text-gray-500
              uppercase
              tracking-wider
            "
          >
            {{ field }}
          </th>
        </tr>
      </thead>

      <!-----------------BODY---------------->
      <tbody class="divide-y divide-gray-200 relative">
        <!----Table rows---->
        <tr
          v-for="(record, rowIndex) in filteredData.data"
          :key="'dqiuqfd' + rowIndex"
          class="hover:bg-gray-50 hover:bg-opacity-50 active:bg-gray-100"
        >
          <td
            class="
              px-4
              py-2
              text-left text-sm
              whitespace-nowrap
              font-bold
              text-gray-900
            "
          >
            {{ filteredData.info.from + rowIndex }}
          </td>
          <td
            v-for="(field, colIndex) in fields"
            :key="rowIndex + '_' + colIndex"
            class="
              px-4
              py-2
              text-left text-sm
              whitespace-nowrap
              font-medium
              text-gray-500
            "
          >
            <div>
              {{ format(field, record[field]) }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Pagination from "./Pagination.vue";
import SvgPending from "/src/svg/Pending.vue";
import { helpers } from "/src/modules/helpers";

export default {
  components: { Pagination, SvgPending },

  props: [
    "parsedData",
    "validData",
    "fields",
    "timestampColumn",
    "timestampSettings",
  ],

  data() {
    return {
      perPage: ["5", "10", "20", "50", "100", "500"],
      currentPageLength: 10,
      currentPage: 1,
      filteredData: [],
      timestampParsingError: false,
    };
  },

  watch: {
    parsedData() {
      this.currentPage = 1;
      this.fetchEntries();
    },
    currentPageLength() {
      this.fetchEntries();
    },
    currentPage() {
      this.fetchEntries();
    },
    fields() {
      this.fetchEntries();
    },
    timestampSettings() {
      this.fetchEntries();
    },

    timestampParsingError() {
      this.$emit("timestampParsingError", this.timestampParsingError);
    },
  },

  methods: {
    pageLengthChange(length) {
      this.currentPageLength = length;
    },

    currentPageOrder(order) {
      switch (order) {
        case "first":
          this.currentPage = 1;
          break;

        case "prev":
          this.currentPage = this.currentPage - 1;
          break;

        case "next":
          this.currentPage = this.currentPage + 1;
          break;

        case "last":
          this.currentPage = this.filteredData.info.pages;
          break;

        default:
          this.currentPage = order;
      }
    },

    fetchEntries() {
      if (!this.validData) return;
      this.timestampParsingError = false;
      this.filteredData = helpers.extractEntries(
        this.parsedData.data,
        this.currentPage,
        this.currentPageLength
      );
    },

    format(field, value) {
      if (field === this.timestampColumn) {
        let date = helpers.parseDateString(value, this.timestampSettings);
        if (date !== null) return date;
        else this.timestampParsingError = true;
      }
      return value;
    },
  },
};
</script>