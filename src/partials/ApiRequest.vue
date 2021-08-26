<template>
  <div
    class="
      border-2
      rounded-md
      border-dashed border-gray-500
      p-4
      flex
      justify-start
      items-baseline
      h-48
      gap-x-4
      overflow-y-hidden
    "
  >
    <div>
      <div>URL</div>
      <select class="rounded-md py-1" v-model="requestType">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
      </select>
    </div>
    <div class="w-full">
      <div>URL</div>
      <input type="text" class="rounded-md py-1 w-full" v-model="url" />
      <div v-show="requestType === 'POST'">Body</div>
      <div v-show="requestType === 'POST'" class="h-20 overflow-y-auto">
        <textarea
          rows="2"
          class="rounded-md w-full p-1"
          v-model="body"
        ></textarea>
      </div>
    </div>
    <div>
      <div>&nbsp;</div>
      <my-button @click="makeRequest">Make&nbsp;request</my-button>
    </div>
  </div>
</template>
<script>
import MyButton from "/src/components/Button.vue";

export default {
  components: {
    MyButton,
  },

  data() {
    return {
      requestType: "GET",
      url: "https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart?id=1027&range=ALL&convertId=2790",
      body: null,
    };
  },

  methods: {
    makeRequest() {
      this.axios({
        method: this.requestType,
        url: this.url,
        data: this.body,
      })
        .then(
          function (response) {
            let data = response.data;
            this.$emit("dataReceived", data);
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>
