<script lang="ts">
  export default {
    name: 'KMainHeader',
  };
</script>
<script setup lang="ts">
  import { useAuthorization } from '@/template/account/authorization/provider';
  import { useStore as useCacheStore } from '@/template/cache';
  import KLogger from '@/template/logger/components/LogsLight.vue';
  import { useMenuStore } from '@/template/menu/store';
  import { apiProvider as uzivatelApiProvider } from '@/views/uzivatel/api';
  import { Menu as MenuIcon, CircleClose } from '@element-plus/icons-vue';
  import { storeToRefs } from 'pinia';
  import { computed, toRefs } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';

  const cacheStore = useCacheStore();

  const cache = storeToRefs(cacheStore);

  const router = useRouter();

  const props = defineProps<{ toggleMenu: boolean }>();
  const propsRef = toRefs(props);
  const emit = defineEmits(['update:toggleMenu', 'unauthorize']);

  const { t } = useI18n();

  const { user, isUnauthorizeVisible } = useAuthorization();

  const loggedUserFullName = computed(() => user.value?.zobrazeneJmeno);

  const appName = computed(() => import.meta.env.VITE_APP_TITLE);
  const appVersion = computed(() => import.meta.env.VITE_APP_VERSION);

  const prepared = computed(() => {
    return true;
  });

  function openUserSetting() {
    // TODO open user setting
  }
  function openHelpUrl() {
    // TODO open help
  }
  function logout() {
    emit('unauthorize');
  }

  function toggleMenuClick() {
    emit('update:toggleMenu', !propsRef.toggleMenu.value);
  }

  function vyrobniLinkaChange(id: number) {
    uzivatelApiProvider.postVyrobniLinku(id);
  }

  function openMain() {
    router.push({ path: '/' });
    const menuStore = useMenuStore();
    const { defaultActive } = storeToRefs(menuStore);
    defaultActive.value = null;
  }
</script>

<style lang="scss" scoped>
  body {
    margin: 0;
  }
  .mainHeaderIcons {
    display: flex;
    align-items: center;
    .planovaciModulIcon {
      margin-right: 7px;

      :first-child {
        font-size: 12px;
      }

      :last-child {
        position: absolute;
        font-size: 10px;
        top: 8px;
        margin: 0;
      }
    }
  }
</style>

<template>
  <div class="k-menu-toggle" @click="toggleMenuClick">
    <el-icon :size="30"><menu-icon /></el-icon>
  </div>
  <div class="logo cursor-p" @click="openMain">
    <span>{{ appName }}</span>
    <span>{{ appVersion }}</span>
  </div>

  <div v-if="prepared" class="mainHeaderIcons">
    <span>
      <!-- <el-icon @click="openHelpUrl" :size="20">
				<question-filled />
			</el-icon> -->
    </span>
    <span class="mr-10">
      <k-logger />
    </span>
    <span>
      <!-- <el-icon :size="20" @click="openUserSetting">
				<user />
			</el-icon> -->
      <k-select
        class="mr-10 mw-13"
        v-if="user"
        :placeholder="t('vyrobniLinka')"
        v-model="user.vyrobniLinkaId"
        :options="cache.dropDownList.value.vyrobniLinka"
        @change="vyrobniLinkaChange"
        v-bind="{ wrapp: false, disabled: false }"
        :clearable="false"
      />
    </span>
    <span class="mr-10">{{ loggedUserFullName }}</span>
    <span v-if="isUnauthorizeVisible" class="mr-10 cursor-p">
      <el-icon @click="logout" :size="20">
        <circle-close />
      </el-icon>
    </span>
  </div>
</template>
