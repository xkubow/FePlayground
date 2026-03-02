<template>
  <k-dialog v-model="keyboard.dialogVisible.value" v-bind="{ showCancel: false, showOk: false }" v-on="{ opened: keyboard.opened, closed: keyboard.closed }">
    <el-input :modelValue="keyboard.keyboardInput.value" clearable @clear="clear" />
    <div v-if="keyboard.selectOption.value" class="w-100 mb-10 mt-10 shadow">
      <el-scrollbar height="200px" always>
        <ul class="el-scrollbar__view pl-0">
          <li v-for="item in filteredOption" :key="item.value" @click="addItem(item)" :class="{ selected: item.selected }" class="el-select-dropdown__item">
            <span>{{ item.text }}</span>
          </li>
        </ul>
      </el-scrollbar>
    </div>
    <div v-show="keyboard.visible.value" :class="keyboard.keyboardClass"></div>
  </k-dialog>
</template>

<script lang="ts" setup>
  import type { DropdownItem } from '@/template/page/@types/mode';
  import 'simple-keyboard/build/css/index.css';
  import { computed, toRefs } from 'vue';
  import { useKeyboardStore } from './store';
  import type { VirtualKeyboard } from './type';

  export interface Props {
    keyboard: VirtualKeyboard;
  }

  const props = defineProps<Props>();
  const { keyboard } = toRefs(props);
  const keyboardStore = useKeyboardStore();

  const filteredOption = computed(() => {
    const query = keyboard.value.keyboardInput.value as string;
    return query ? keyboard.value.selectOption.value?.filter((i) => i.text.localeInclude(query)) : keyboard.value.selectOption.value;
  });

  function clear() {
    keyboard.value.clear();
  }

  function addItem(item: DropdownItem<string | number> & { selected?: boolean }) {
    item.selected = !item.selected;
    keyboardStore.selectItem && keyboardStore.selectItem(item);

    const onChange = keyboard.value?.change?.value;
    onChange && onChange(item.value);
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
