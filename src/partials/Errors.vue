<template>
  <div v-if="errors !== null">
    <div class="my-2 font-bold">The following errors occured:</div>
    <div
      v-for="(error, index) in errors"
      :key="index"
      class="
        border border-red-500
        bg-red-100
        p-4
        rounded-md
        text-red-500 text-sm
        mb-2
      "
    >
      <div class="font-bold">
        {{
          error.hasOwnProperty("row")
            ? "Row " + error.row + ": " + error.type
            : error.type
        }}
      </div>
      <div>{{ error.message }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["errors"],
};
</script>