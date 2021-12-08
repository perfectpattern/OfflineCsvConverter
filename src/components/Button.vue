<template>
  <button
    @click="visit"
    :type="type"
    :disabled="disabled || pending"
    class="
      inline-flex
      items-center
      rounded-md
      font-semibold
      text-xs
      uppercase
      tracking-widest
      transition
      ease-in-out
      duration-150
      outline-none
      focus:outline-none
      whitespace-nowrap
    "
    :class="classes"
  >
    <!--icon-->
    <div
      v-if="icon !== null"
      class=""
      :class="{
        'h-6 w-6': size === 'large',
        'h-5 w-5': size === 'normal',
        'h-4 w-4': size === 'small',
        '-ml-1 mr-2': showText,
      }"
    >
      <div v-show="!pending">
        <svg-caret-down v-if="icon === 'caretDown'"></svg-caret-down>
        <svg-check v-if="icon === 'check'"></svg-check>
        <svg-chevron-down
          v-if="icon === 'chevronDown' || icon === 'down'"
        ></svg-chevron-down>
        <svg-chevron-left v-if="icon === 'chevronLeft'"></svg-chevron-left>
        <svg-chevron-left-double
          v-if="icon === 'chevronLeftDouble'"
        ></svg-chevron-left-double>
        <svg-chevron-right v-if="icon === 'chevronRight'"></svg-chevron-right>
        <svg-chevron-right-double
          v-if="icon === 'chevronRightDouble'"
        ></svg-chevron-right-double>
        <svg-delete v-if="icon === 'delete'"></svg-delete>
        <svg-download v-if="icon === 'download'"></svg-download>
        <svg-duplicate
          v-if="icon === 'duplicate' || icon === 'copy'"
        ></svg-duplicate>
        <svg-info v-if="icon === 'info'"></svg-info>
        <svg-pencil v-if="icon === 'pencil' || icon === 'edit'"></svg-pencil>
        <svg-plus v-if="icon === 'plus' || icon === 'add'"></svg-plus>
        <svg-reload v-if="icon === 'reload'"></svg-reload>
        <svg-save v-if="icon === 'save'"></svg-save>
        <svg-upload v-if="icon === 'upload'"></svg-upload>
        <svg-x v-if="icon === 'x' || icon === 'cancel'"></svg-x>
        <svg-x-circle v-if="icon === 'xCircle'"></svg-x-circle>
      </div>
      <svg-pending v-show="pending" />
    </div>

    <!--no icon (placeholder instead)-->
    <div
      v-else
      :class="{
        'h-6': size === 'large',
        'h-5': size === 'normal',
        'h-4': size === 'small',
      }"
    ></div>

    <!--text slot-->
    <slot v-if="showText"></slot>
  </button>
</template>

<script>
import SvgCaretDown from "/src/svg/CaretDown.vue";
import SvgCheck from "/src/svg/Check.vue";
import SvgChevronDown from "/src/svg/ChevronDown.vue";
import SvgChevronLeft from "/src/svg/ChevronLeft.vue";
import SvgChevronLeftDouble from "/src/svg/ChevronLeftDouble.vue";
import SvgChevronRight from "/src/svg/ChevronRight.vue";
import SvgChevronRightDouble from "/src/svg/ChevronRightDouble.vue";
import SvgDelete from "/src/svg/Delete.vue";
import SvgDownload from "/src/svg/Download.vue";
import SvgDuplicate from "/src/svg/Duplicate.vue";
import SvgHome from "/src/svg/Home.vue";
import SvgInfo from "/src/svg/Info.vue";
import SvgPencil from "/src/svg/Pencil.vue";
import SvgPending from "/src/svg/Pending.vue";
import SvgPlus from "/src/svg/Plus.vue";
import SvgReload from "/src/svg/Refresh.vue";
import SvgSave from "/src/svg/Save.vue";
import SvgUpload from "/src/svg/Upload.vue";
import SvgX from "/src/svg/X.vue";
import SvgXCircle from "/src/svg/XCircle.vue";

export default {
  components: {
    SvgCaretDown,
    SvgCheck,
    SvgChevronDown,
    SvgChevronLeftDouble,
    SvgChevronLeft,
    SvgChevronRight,
    SvgChevronRightDouble,
    SvgDelete,
    SvgDownload,
    SvgDuplicate,
    SvgHome,
    SvgInfo,
    SvgPencil,
    SvgPending,
    SvgPlus,
    SvgReload,
    SvgSave,
    SvgUpload,
    SvgX,
    SvgXCircle,
  },

  props: {
    href: {
      type: String,
      default: null,
    },

    type: {
      type: String,
      default: "submit",
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    icon: {
      type: String,
      default: null,
    },

    color: {
      type: String,
      default: "white",
    },

    size: {
      type: String,
      default: "normal",
    },

    pending: {
      type: Boolean,
      default: false,
    },

    showText: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    classes() {
      let cls = [];

      //size
      if (this.size === "large") cls.push("px-5 py-3");
      if (this.size === "normal") cls.push("px-4 py-2");
      if (this.size === "small") cls.push("px-3 py-1");

      //Colors
      switch (this.color) {
        case "blue":
          cls.push(
            "bg-white",
            "text-blue-300",
            "border",
            "border-blue-300",
            "hover:text-blue-500",
            "active:text-blue-500",
            "active:bg-blue-100"
          );
          break;

        case "blue-full":
          cls.push(
            "bg-blue-300",
            "text-white",
            "border",
            "border-blue-300",
            "hover:bg-blue-400",
            "hover:border-blue-400",
            "active:bg-blue-500",
            "active:border-blue-500"
          );
          break;

        case "gray-full":
          cls.push(
            "bg-gray-400",
            "text-white",
            "border",
            "border-gray-400",
            "hover:bg-gray-600",
            "hover:border-gray-600",
            "active:bg-gray-700",
            "active:border-gray-700"
          );
          break;

        case "red":
          cls.push(
            "bg-white",
            "text-red-400",
            "border",
            "border-red-400",
            "hover:text-red-500",
            "active:text-red-500",
            "active:bg-red-100"
          );
          break;

        case "red-full":
          cls.push(
            "bg-red-500",
            "text-white",
            "border",
            "border-red-500",
            "hover:bg-red-600",
            "hover:border-red-600",
            "active:bg-red-700",
            "active:border-red-700"
          );
          break;

        case "gold":
          cls.push(
            "bg-gold-400",
            "text-white",
            "border",
            "border-gold-400",
            "hover:bg-gold-500",
            "hover:border-gold-500",
            "active:bg-gold-600",
            "active:border-gold-600"
          );
          break;

        case "white":
          cls.push(
            "bg-white border border-gray-400 text-gray-400",
            "hover:text-gray-500",
            "active:text-gray-500",
            "active:bg-gray-200"
          );
          break;

        default:
          break;
      }

      //disabled or pending
      if (this.disabled || this.pending) cls.push("opacity-50 cursor-default");

      return cls.join(" ");
    },
  },

  methods: {
    visit() {
      if (this.href != null) this.$inertia.get(this.href);
    },
  },
};
</script>