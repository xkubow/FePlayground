<template>
  <div class="fullframe">
    Not found
    <!-- <img class="center" src="/img/not_found.jpg" width="500px" alt="not_found" /> -->
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageMode } from './providers/pageMode';

  export default defineComponent({
    name: 'NotFound',
    beforeCreate() {
      if (this.$route.meta && this.$route.meta.hasList) {
        let path = this.$route.fullPath;

        path[path.length - 1] !== '/' && (path += '/');

        this.$router.replace(`${path}${PageMode.LIST}`);
      }
    },
  });
</script>

<style scoped>
  .fullframe {
    width: 100%;
    height: 100%;
    display: flex;
  }
  .center {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
