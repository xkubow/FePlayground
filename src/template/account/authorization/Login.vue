<template>
  <el-container class="login-wrapper">
    <div class="left-panel">
      <div class="login">
        <div class="title">
          {{ t('loginTitle') }}
        </div>

        <el-form id="login-form" label-position="top">
          <el-form-item :label="t('loginName')" label-width="120px">
            <div class="el-input el-input--mini">
              <input
                id="login-name-input"
                :placeholder="t('loginName')"
                ref="loginName"
                v-model="name"
                type="text"
                autocomplete="off"
                autofocus
                class="el-input__inner"
                @keyup.enter="logIn"
                autocapitalize="off"
                spellcheck="false"
                autocorrect="off"
              />
            </div>
          </el-form-item>
          <el-form-item :label="t('password')" label-width="120px">
            <div class="el-input el-input--mini">
              <input :placeholder="t('password')" v-model="password" type="password" autocomplete="off" class="el-input__inner" @keyup.enter="logIn" />
            </div>
          </el-form-item>
          <el-button id="login-button" class="button" type="primary" @click="logIn" data-testid="login-button">
            {{ t('Login') }}
          </el-button>
        </el-form>
      </div>
    </div>
    <div class="overlay" />
    <div class="background" />
  </el-container>
</template>

<script lang="ts">
  export default {
    name: 'KLogin',
  };
</script>

<script setup lang="ts">
  import { useAuthorization as useProviderAuthorization } from '@/template/account/authorization/provider';
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const name = ref('');
  const password = ref('');
  const authorization = useProviderAuthorization();

  async function logIn() {
    await authorization.authorize({ login: name.value, password: password.value });
  }
</script>

<style scoped></style>
