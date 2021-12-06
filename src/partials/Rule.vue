<template>
  <div v-if="initialized">
    <div class="flex justify-between items-center mb-4 border-b pb-2 mt-10">
      <div class="text-xl">New column</div>
      <div @click="$emit('remove-rule', id)">remove</div>
    </div>
    <div class="mb-4 flex gap-x-2">
      <div>
        <div class="mb-2 flex justify-between">
          <div class="text-sm font-semibold">Name</div>
        </div>
        <jet-input
          class="rounded-md py-1 h-10"
          type="text"
          v-model="columns[this.id].name"
        />
      </div>
      <div class="w-full">
        <div class="mb-2 flex justify-between">
          <div class="text-sm font-semibold">Source columns</div>
        </div>
        <Multiselect
          v-model="columns[this.id].fields"
          @update:modelValue="resetCode"
          mode="tags"
          :closeOnSelect="false"
          :searchable="true"
          :createTag="false"
          :options="columnsArray"
          class="rounded-md"
        />
      </div>
    </div>
    <div class="flex justify-between gap-x-4">
      <!--Format as -->
      <div class="w-2/3">
        <div class="mb-2 flex justify-between items-center">
          <div class="text-sm font-semibold">Javascript coded rule</div>
          <div
            class="
              px-2
              py-0
              text-xs
              uppercase
              bg-blue-300
              hover:bg-blue-400
              active:bg-blue-500
              rounded-md
              text-white
              cursor-pointer
            "
            @click="applyRule"
          >
            apply
          </div>
        </div>
        <div class="rounded-md overflow-y-auto overflow-x-hidden h-32">
          <prism-editor
            class="my-editor"
            v-model="code"
            :highlight="highlighter"
            line-numbers
          ></prism-editor>
        </div>
      </div>

      <!--Preview box-->
      <div class="w-1/3">
        <div class="mb-2 flex justify-between">
          <div class="text-sm font-semibold">Preview</div>
        </div>
        <dashed-box class="border-gray-500 block h-32">
          <div class="w-full">
            <preview :parsedData="parsedData" :column="this.columns[this.id]" />
          </div>
        </dashed-box>
      </div>
    </div>
  </div>
</template>

<script>
import { helpers } from "/src/modules/helpers";
import SvgCheck from "/src/svg/Check.vue";
import JetInput from "/src/components/jetstream/Input.vue";
import DashedBox from "/src/components/DashedBox.vue";
import MySwitch from "/src/components/SwitchSmall.vue";
import Preview from "/src/components/Preview.vue";
import Multiselect from "@vueform/multiselect";
import { PrismEditor } from "vue-prism-editor"; //
import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere
import prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighting styles

export default {
  components: {
    SvgCheck,
    JetInput,
    DashedBox,
    MySwitch,
    Preview,
    Multiselect,
    PrismEditor,
  },

  props: {
    id: {
      default: null,
    },

    columns: {
      default: null,
    },

    parsedData: {
      default: null,
    },
  },

  data() {
    return {
      initialized: false,
      code: "",
      columnsArray: [],
    };
  },

  created() {
    this.initialize();
  },

  watch: {
    columns: {
      handler(val, oldVal) {
        //Column null
        if (val === null) {
          this.columnsArray = [];
        }

        //Otherwise
        else {
          //update columnsArray
          let arr = helpers.columnsToSortedArray(this.columns, "value");
          arr.forEach((element) => {
            element.label = element.name;
            element.value = element.fields[0];
          });
          this.columnsArray = arr;
        }
      },
      deep: true,
    },
  },

  methods: {
    applyRule() {
      this.columns[this.id].rule = this.code;
    },

    resetCode() {
      let n = this.columns[this.id].fields.length;
      let arr = [];
      for (var i = 0; i < n; i++) arr.push("parseFloat(values[" + i + "])");
      this.code = arr.join("+");
      this.applyRule();
    },

    highlighter(code) {
      return prism.highlight(code, prism.languages.js);
    },

    initialize() {
      if (this.columns === null) return;
      this.columns[this.id] = {
        fields: [],
        name: "Custom name",
        id: this.id,
        rule: null,
        tags: ["rule"],
        origin: "created",
      };
      this.initialized = true;
    },
  },
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style>
.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #2d2d2d;
  color: #ccc;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}

.height-200 {
  height: 200px;
}

.mb-4 {
  margin-bottom: 1rem;
}
</style>
