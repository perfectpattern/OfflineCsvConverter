<template>
  <div class="bg-gray-100 pb-3 border-b relative">
    <!--Version-->
    <div
      class="
        absolute
        top-2
        right-2
        text-xs
        font-semibold
        text-gray-500
        transform
        scale-75
      "
    >
      V {{ appVersion }}
    </div>

    <div class="text-center py-4 text-4xl font-semibold text-blue-300">
      CSV Converter
    </div>

    <div
      class="
        text-center text-lg
        py-2
        font-semibold
        flex
        items-center
        justify-center
        gap-x-2
      "
    >
      100% on your device - no data upload!
    </div>

    <div class="mt-2 mb-6 text-center text-sm">
      Parse & format a CSV to use it e.g. for AutoML like
      <a href="https://perfectpattern.de" target="_blank">aivis</a>. The
      conversion happens purely client-based. No data is uploaded, saved or
      sent.
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
import { version } from "../../package";
export default {
  components: {
    Badge,
    SvgGithub,
  },
  data: () => ({
    appVersion: version,
  }),
};
</script>