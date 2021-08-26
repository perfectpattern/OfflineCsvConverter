<template>
  <div class="bg-gray-100 pb-3">
    <div class="text-center py-4 text-4xl font-semibold text-blue-300">
      Offline CSV Conversion
    </div>

    <div class="text-center text-lg py-2 font-semibold">
      client-based conversion of
      <badge> CSV to CSV </badge>
      and
      <badge> JSON to CSV </badge>
    </div>

    <div class="mt-2 mb-6 text-center text-sm">
      This tool is designed to quickly parse and format any CSV or JSON data up
      to few hundred Megabytes into a target CSV format so it can be used for AutoML like e.g.
      <a href="https://perfectpattern.de" target="_blank">aivis</a>. It is
      purely client-based and does not save or send any data.
    </div>

    <div class="text-xs font-semibold text-center flex justify-center mt-2">
      <div class="">
        Tool created by
        <a href="https://perfectpattern.de" target="_blank"
          >PerfectPattern GmbH</a
        >
      </div>
      <div class="mx-2">·</div>
      <div class="">
        Repository: <svg-github class="h-4 w-4 inline mx-1" />
        <a href="https://github.com/perfectpattern/offline-csv-converter"
          >github.com/perfectpattern/offline-csv-converter</a
        >
      </div>
      <div class="mx-2">·</div>
      <div class="">
        Based on: <a href="https://vitejs.dev/">Vite</a> -
        <a href="https://v3.vuejs.org/">Vue3</a> -
        <a href="https://tailwindcss.com/">tailwindcss</a> -
        <a href="https://www.papaparse.com/">papaparse</a> -
        <a href="https://momentjs.com/">moment</a> -
        <a href="https://github.com/axios/axios">axios</a>
      </div>
    </div>
  </div>
</template>
<script>
import Badge from "/src/components/Badge.vue";
import SvgGithub from "/src/svg/Github.vue";
export default {
  components: {
    Badge,
    SvgGithub,
  },
  setup() {},
};
</script>