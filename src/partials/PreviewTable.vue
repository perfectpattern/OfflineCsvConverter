<template>
  <div v-if="show">
    <div class="flex justify-between items-center mt-10 mb-4 border-b pb-2">
      <div class="text-xl">Output preview</div>
    </div>
    <!--Pagination-->
    <pagination
      class="flex-shrink-0 rounded"
      :info="filteredData.info"
      :perPage="perPage"
      @pageOrder="currentPageOrder"
      @pageLengthChanged="pageLengthChange"
    >
    </pagination>
    <div class="overflow-x-auto">
      <!--Table-->
      <table class="min-w-full divide-y divide-gray-200">
        <!--------------------HEADER--------------------->
        <thead class="bg-gray-100">
          <tr class="">
            <!--Counter column-->
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

            <!--Timestamp-->
            <!--<th
              v-if="columns.timestamp.fields.length > 0"
              :key="'ts'"
              class="
                px-4
                py-2
                pt-3
                text-left text-xs
                font-medium
                text-gray-500
                tracking-wider
              "
            >
              timestamp
            </th>-->

            <!--Values-->
            <th
              v-for="column in columnsToShow"
              :key="column.id + 'vl'"
              class="
                px-4
                py-2
                pt-3
                text-left text-xs
                font-medium
                text-gray-500
                tracking-wider
              "
            >
              {{ column.name }}
            </th>
          </tr>
        </thead>

        <!-----------------BODY---------------->
        <tbody class="divide-y divide-gray-200 relative">
          <!----Table rows---->
          <tr
            v-for="(row, rowIndex) in filteredData.data"
            :key="'row' + rowIndex"
            class="hover:bg-gray-50 hover:bg-opacity-50 active:bg-gray-100"
          >
            <!--Counter column-->
            <td
              class="
                px-4
                py-2
                text-left text-sm
                whitespace-nowrap
                font-semibold
                text-gray-900
              "
            >
              {{ filteredData.info.from + rowIndex }}
            </td>

            <!--Timestamp-->
            <!--<td
              v-if="columns.timestamp.fields.length > 0"
              :key="'ts_val' + rowIndex"
              class="
                px-4
                py-2
                text-left text-sm
                whitespace-nowrap
                font-normal
                text-gray-500
              "
            >
              <div>
                {{ format(row, columns.timestamp) }}
              </div>
            </td>-->

            <!--Values-->
            <td
              v-for="(column, colIndex) in columnsToShow"
              :key="rowIndex + '_' + colIndex"
              class="
                px-4
                py-2
                text-left text-sm
                whitespace-nowrap
                font-normal
                text-gray-500
              "
            >
              <div>
                {{ format(row, column) }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!--<div v-else class="text-gray-400 font-semibold">
    Currently there is no data to display. Please load CSV or JSON to proceed.
  </div>-->
</template>

<script>
import Pagination from "/src/components/Pagination.vue";
import SvgPending from "/src/svg/Pending.vue";
import { helpers } from "/src/modules/helpers";
import { formatter } from "/src/modules/formatter";

export default {
  components: { Pagination, SvgPending },

  props: {
    parsedData: {
      default: null,
    },

    columns: {
      default: null,
    },
  },

  data() {
    return {
      perPage: ["5", "10", "20", "50"],
      currentPageLength: 10,
      show: false,
      currentPage: 1,
      fieldsDisplayNames: [],
      filteredData: [],
      columnsToShow: [],
      timestampParsingError: false,
    };
  },

  created() {
    this.update();
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

    columns: {
      handler(val, oldVal) {
        this.update();
      },
      deep: true,
    },

    timestampParsingError() {
      this.$emit("timestampParsingError", this.timestampParsingError);
    },
  },

  methods: {
    update() {
      if (this.columns === null) {
        this.show = false;
        this.columnsToShow = [];
      } else {
        this.show = true;
        this.columnsToShow = helpers.getOutputColumnsArray(this.columns);
        this.fetchEntries();
      }
    },

    pageLengthChange(length) {
      this.currentPageLength = length;
    },

    currentPageOrder(order) {
      switch (order) {
        case "first":
          this.currentPage = 1;
          break;

        case "prev":
          this.currentPage = parseInt(this.currentPage) - 1;
          break;

        case "next":
          this.currentPage = parseInt(this.currentPage) + 1;
          break;

        case "last":
          this.currentPage = this.filteredData.info.pages;
          break;

        default:
          this.currentPage = order;
      }
    },

    fetchEntries() {
      this.timestampParsingError = false;
      this.filteredData = helpers.extractEntries(
        this.parsedData,
        this.currentPage,
        this.currentPageLength
      );
    },

    format(row, column) {
      //format value
      let formatted = formatter.format(row, column);

      //Error
      if (formatted.error) return "ERROR";

      //Success
      return formatted.formatted;
    },
  },
};
</script>