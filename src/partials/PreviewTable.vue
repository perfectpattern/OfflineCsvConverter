<template>
  <div v-if="validData" class="">
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
            <th
              v-if="hasTimestamp"
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
            </th>

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
            v-for="(record, rowIndex) in filteredData.data"
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
            <td
              v-if="hasTimestamp"
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
                {{ format(field, record[field]) }}
              </div>
            </td>

            <!--Values-->
            <td
              v-for="(field, colIndex) in fields"
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
                {{ format(field, record[field]) }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-else class="text-gray-400 font-semibold">
    Currently there is no data to display. Please load CSV or JSON to proceed.
  </div>
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
    validData: {
      default: false,
    },
    columns: {
      default: null,
    },
    rules: {
      default: null,
    },
  },

  data() {
    return {
      perPage: ["5", "10", "20", "50", "100", "500"],
      currentPageLength: 10,
      currentPage: 1,
      fieldsDisplayNames: [],
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
    columns() {
      this.fetchEntries();
    },
    rules() {
      this.fetchEntries();
    },

    timestampParsingError() {
      this.$emit("timestampParsingError", this.timestampParsingError);
    },
  },

  computed: {
    hasTimestamp() {
      if (this.columns === null) return false;
      return helpers.getColumnsByTag("timestamp").length > 0;
    },

    columnsToShow() {
      if (this.columns === null) return [];
      return helpers.getColumnsByTag("value");
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
      if (!this.validData) return;
      this.timestampParsingError = false;
      this.filteredData = helpers.extractEntries(
        this.parsedData.data,
        this.currentPage,
        this.currentPageLength
      );
    },

    /*updateFieldsDisplayNames() {
      this.fieldsDisplayNames = [];
      for (var i = 0; i < this.fields.length; i++) {
        let field = this.fields[i];
        this.fieldsDisplayNames.push(
          this.renamings.hasOwnProperty(field) ? this.renamings[field] : field
        );
      }
    },*/

    format(field, value) {
      //prepare options
      let options = {
        isTimestamp: field === this.timestampColumns,
        timestampSettings: this.timestampSettings,
      };

      //format value
      let formatted = formatter.format(value, options);

      //Error
      if (formatted.error) {
        if (options.isTimestamp) this.timestampParsingError = true;
        return value;
      }

      //Success
      return formatted.value;
    },
  },
};
</script>