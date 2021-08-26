<template>
 <label class="inline-flex items-center">
    <input
      type="checkbox"
      class="form-checkbox h-6 w-6 rounded-md bg-gray-100 cursor-pointer"
      :class="{
        'text-red-400': selected && exclude,
        'text-red-100': !selected && exclude,
        'text-green-500': selected && !exclude,
        'text-green-100': !selected && !exclude,
      }"      
      :checked="selected"
      @change="inputChanged"
      :disabled="readonly"
    />
  </label>
</template>

<script>
export default {
  props: ["value", "id", "exclude", "blockUncheck"],

  data() {
    return {
      selected: this.value,
    };
  },

  computed : {
    readonly(){
      return this.blockUncheck && this.selected;
    }
  },

  methods: {
    inputChanged() {
      this.selected = !this.selected;
      if(this.blockUncheck && !this.selected) return;
      //console.log(this.id + " is " + this.selected);
      this.$emit("input", this.id, this.selected);
    },
  },
};
</script>