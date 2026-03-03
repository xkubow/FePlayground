<template>
  <div class="qr-scaner_wrapper">
    <div class="qr-scaner">Tu je scanner</div>
    <span class="colse-fixed">
      <k-button circle plain size="large" :disabled="false" @click.once="back">
        <k-icon :size="30">
          <close-icon />
        </k-icon>
      </k-button>
    </span>
  </div>
</template>

<script lang="ts">
  import { Close as CloseIcon } from '@element-plus/icons-vue';
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    components: {
      CloseIcon,
    },
    setup() {
      const router = useRouter();

      function back() {
        router.back();
      }

      return { CloseIcon, back };
    },
  });
</script>

<style lang="scss" scoped>
  .colse-fixed {
    position: fixed;
    top: 0;
    right: 0;
    overflow: hidden;
    margin-top: 10px;
    margin-right: 10px;
    button {
      background-color: inherit !important;
      i {
        margin: 0px;
      }
    }
  }
  .qr-scaner_wrapper {
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2000;
    background-color: rgba(0, 0, 0);
    overflow: auto;
    justify-content: space-evenly;

    @media screen and (orientation: portrait) {
      flex-direction: column;
    }
    @media screen and (orientation: landscape) {
      flex-direction: row;
    }
  }
  .qr-scaner {
  }
</style>
