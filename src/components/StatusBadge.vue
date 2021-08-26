<template>
  <span
    :class="colors(status)"
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
  >
    {{ status }}
  </span>
</template>
<script>
export default {
  props: ["status"],
  methods: {
    colors(status) {
      switch (status.toUpperCase()) {
        case "FAILED":
        case "CANCELED":
          return "bg-red-100 text-red-800";

        case "SUCCESS":
          return "bg-green-100 text-green-800";

        case "RUNNING":
          return "bg-indigo-100 text-indigo-800";

        default:
          return "bg-gray-100 text-gray-800";
      }
    },
  },
};
</script>