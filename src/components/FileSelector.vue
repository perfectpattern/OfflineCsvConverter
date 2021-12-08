<template>
  <div
    class="
      relative
      mt-2
      flex
      justify-center
      px-6
      py-24
      border-2 border-gray-300 border-dashed
      rounded-md
    "
    :class="{
      'border-blue-500 bg-gray-50': fileOverDropArea,
      'border-gray-500': !fileOverDropArea,
    }"
    @drop.prevent="droppedFiles"
    @dragover.prevent
    @dragenter.prevent="dragenter"
    @dragleave.prevent="dragleave"
  >
    <div class="space-y-1 text-center">
      <svg
        :class="{
          'text-blue-500': fileOverDropArea,
          'text-gray-400': !fileOverDropArea,
        }"
        class="mx-auto h-12 w-12"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>

      <div class="text-sm text-gray-600 justify-center">
        <p class="font-semibold text-2xl">Drag & Drop CSV file HERE</p>
        <p class="">or</p>

        <div class="flex gap-x-2 justify-center items-center text-base">
          <!--Select file-->
          <label
            for="file-upload"
            class="
              relative
              cursor-pointer
              rounded-md
              text-lg
              font-semibold
              text-blue-300
              hover:text-blue-500
              focus-within:outline-none
            "
          >
            <span>Select file</span>
            <input
              id="file-upload"
              name="file-upload"
              @change="selectedFiles"
              type="file"
              ref="fileupload"
              class="sr-only"
              accept="accept"
            />
          </label>

          <!--<p>|</p>
          <div
            @click="readClipboard"
            class="
              cursor-pointer
              font-semibold
              text-blue-300
              hover:text-blue-500
              focus-within:outline-none
            "
          >
            Read from clipboard
          </div>-->
        </div>

        <div class="mt-4 mb-2 text-center text-sm font-semibold">
          Max size: A few 100 MB
        </div>
        <div class="text-center text-xs font-semibold text-gray-400">
          (limit depending on your devices hardware performance)
        </div>
        <div v-if="text" class="text-gray-500 text-center mt-2 text-xs">
          {{ text }}
        </div>
        <div v-show="filename" class="text-gray-500 text-center mt-2 text-xs">
          {{ filename }}
        </div>
        <!--Errors-->
        <div class="text-red-500 mt-1 flex justify-end text-xs font-bold">
          <div>{{ message !== null ? message : " " }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MyButton from "/src/components/Button.vue";

export default {
  components: { MyButton },

  props: ["accept", "text", "filename"],

  emits: ["file-selected", "read-clipboard"],

  data() {
    return {
      message: null,
      fileOverDropArea: false,
      file: undefined,
      dragcount: 0,
      pending: false,
    };
  },

  methods: {
    droppedFiles(e) {
      let droppedFiles = e.dataTransfer.files;
      if (!droppedFiles) {
        this.fileOverDropArea = false;
        return;
      }
      //convert to array
      if (typeof droppedFiles === "object") {
        droppedFiles = [droppedFiles[0]];
      }
      let files = this.filterByAccept(droppedFiles);
      this.filesSelected(files);
      this.fileOverDropArea = false;
    },

    selectedFiles(event) {
      let unfilteredFiles = event.target.files;
      //convert to array
      if (typeof unfilteredFiles === "object") {
        unfilteredFiles = [unfilteredFiles[0]];
      }
      let files = this.filterByAccept(unfilteredFiles);
      this.filesSelected(files);
      this.$refs.fileupload.value = null;
    },

    filesSelected(files) {
      this.$emit("file-selected", files[0]);
    },

    readClipboard(files) {
      this.message = null;
      this.$emit("read-clipboard");
    },

    dragenter() {
      this.dragcount++;
      this.fileOverDropArea = true;
    },

    dragleave() {
      this.dragcount--;
      if (this.dragcount <= 0) this.fileOverDropArea = false;
    },

    filterByAccept(droppedFiles) {
      this.message = null;
      let allowedFileExtensions = [];
      let allowedFileTypes = [];

      this.accept.split(",").forEach((item) => {
        let entry = item.trim();
        if (entry[0] === ".") allowedFileExtensions.push(entry);
        if (entry.indexOf("application") == 0) allowedFileTypes.push(entry);
      });

      let files = [];
      droppedFiles.forEach((file) => {
        //check file type
        if (allowedFileTypes.includes(file.type)) {
          //check file extension
          let fileExt = this.getFileExtension(file.name);
          if (allowedFileExtensions.includes(fileExt)) {
            //Success
            files.push(file);
          }
          //Failed
          else {
            this.message =
              "Skipped file because file extension is wrong: " +
              file.name +
              ".";
          }
        }
        //Failed
        else {
          this.message =
            "Skipped file because filetype is wrong: " + file.name + ".";
        }
      });
      return files;
    },

    getFileExtension(filename) {
      return "." + filename.split(".").pop();
    },
  },
};
</script>