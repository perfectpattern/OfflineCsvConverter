<template>
  <dashed-box class="border-gray-500">
    <div
      class="flex justify-start items-baseline gap-x-4 overflow-y-hidden w-full"
    >
      <div>
        <div>URL</div>
        <select
          class="
            py-1
            border-gray-300
            focus:outline-none
            focus:ring-0
            focus:border-blue-200
            rounded-md
            shadow-sm
          "
          v-model="requestType"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
      </div>
      <div class="w-full">
        <div>URL</div>
        <jet-input type="text" class="w-full" v-model="url" />
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
        <my-button @click="makeRequest" class="bg-blue-300">Send</my-button>
      </div>
    </div>
  </dashed-box>
</template>
<script>
import MyButton from "/src/components/Button.vue";
import DashedBox from "/src/components/DashedBox.vue";
import JetInput from "/src/components/jetstream/input.vue";

export default {
  components: {
    MyButton,
    DashedBox,
    JetInput,
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
