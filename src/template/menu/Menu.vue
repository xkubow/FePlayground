<template>
  <el-menu v-bind="{ defaultActive }" class="k-menu" :collapse="toggleMenu">
    <k-main-menu-item />
  </el-menu>
</template>

<script lang="ts">
  export default {
    name: 'k-mian-menu',
  };
</script>
<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { useRouter } from 'vue-router';
  import { editName, listName } from '../page/constants';
  import { UriType } from './constants';
  import KMainMenuItem from './MenuItem.vue';
  import { menuTree } from './menuTree';
  import { useMenuStore } from './store';

  const router = useRouter();
  const menuStore = useMenuStore();
  const { defaultActive } = storeToRefs(menuStore);

  defineProps<{ toggleMenu: boolean }>();

  const menuMaped = menuTree.menu.map((i) => {
    switch (i.uriType) {
      case UriType.LIST:
        return listName(i.to as string);
      case UriType.EDIT:
        return editName(i.to as string);
      default:
        return listName(i.to as string);
    }
  });
  const menuIndex = menuMaped.findIndex((i) => i === router.currentRoute.value.name);
  defaultActive.value = menuIndex.toString();
</script>

<style lang="scss" scoped></style>
