<template>
  <div v-if="initialized">
    <section-title :hideIntro="!showExplanations">
      New column
      <template #complement>
        <div class="flex justify-end, gap-x-4">
          <my-button
            :color="'red'"
            :icon="'x'"
            @click="$emit('remove-rule', id)"
            >Remove</my-button
          >
        </div>
      </template>
      <template #intro>
        EXPERT FEATURE! Define your new column by giving it a name, choosing
        source columns and write javascript code to define the column content.
      </template>
    </section-title>

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
          @update:modelValue="columnSelectionUpdated"
          mode="tags"
          :closeOnSelect="false"
          :searchable="true"
          :createTag="false"
          :options="columnsArray"
          class="rounded-md"
        />
      </div>
    </div>
    <my-transition>
      <div v-show="showEditor">
        <div class="flex justify-between gap-x-4">
          <!--Format as -->
          <div class="w-2/3">
            <div class="mb-2 flex justify-between items-center h-6">
              <div class="text-sm font-semibold">Javascript coded rule</div>
            </div>
            <div
              class="rounded-md overflow-y-auto overflow-x-hidden relative"
              style="height: calc(100% - 30px)"
            >
              <prism-editor
                class="my-editor"
                v-model="code"
                @update:modelValue="codeUnsaved = true"
                :highlight="highlighter"
                line-numbers
              />
              <my-transition>
                <div
                  v-show="codeUnsaved"
                  class="
                    px-2
                    py-0
                    text-xs
                    uppercase
                    bg-blue-300
                    hover:bg-blue-400
                    active:bg-blue-500
                    rounded-sm
                    text-white
                    cursor-pointer
                    absolute
                    right-4
                    bottom-4
                    border
                  "
                  @click="saveCode"
                >
                  apply
                </div>
              </my-transition>
            </div>
          </div>

          <!--Preview box-->
          <div class="w-1/3">
            <div class="mb-2 flex justify-between">
              <div class="text-sm font-semibold">Preview</div>
              <div class="flex justify-end gap-x-2 items-center">
                <div class="uppercase text-xs text-gray-500 font-semibold">
                  row
                </div>
                <preview
                  :parsedData="parsedData"
                  :column="columns[this.id]"
                  :hideBox="true"
                  @update="updatePreview"
                />
              </div>
            </div>
            <dashed-box class="border-gray-500 block">
              <div class="w-full">
                <value>
                  <template #title>Input</template>
                  [{{ rawString }}]
                </value>
                <value :error="formatted.error">
                  <template #title>Output</template>
                  {{
                    formatted.error ? formatted.errorMsg : formatted.formatted
                  }}
                </value>
              </div>
            </dashed-box>
          </div>
        </div>
        <div class="text-sm text-gray-500 mt-2" v-show="showExplanations">
          Describe the output with help of javascript code. Your first chosen
          column is values[0], the second is values[1] and so on. Apply code
          changes to make them visible in the preview. Use the preview row
          selector to try your code on various rows.
        </div>
      </div>
    </my-transition>
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

    showExplanations: {
      default: true,
    },
  },

  data() {
    return {
      initialized: false,
      code: "",
      columnsArray: [],
      rawString: null,
      formatted: null,
      previewIndex: null,
      showEditor: false,
      codeUnsaved: false,
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
          this.showEditor = false;
        }

        //Otherwise
        else {
          //update columnsArray
          let arr = helpers.columnsToSortedArray(val, "value");
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
    updatePreview(rawString, formatted, previewIndex) {
      this.rawString = rawString;
      this.formatted = formatted;
      this.previewIndex = previewIndex;
    },

    saveCode() {
      this.columns[this.id].rule = this.code;
      this.codeUnsaved = false;
    },

    columnSelectionUpdated(value) {
      //Update editor visibility
      this.showEditor = value.length > 0;

      //Create default code snipped
      let arr = [];
      for (var i = 0; i < value.length; i++)
        arr.push("parseFloat(values[" + i + "])");
      this.code = arr.join("+");
      this.saveCode();
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
