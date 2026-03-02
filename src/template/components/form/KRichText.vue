<script setup lang="ts">
  import type { Priloha } from '@/views/prilohy/type';
  import type { IBaseInputProps } from '../@types/input';
  import { baseInput } from '@/template/components/base/baseInput';
  import { Finished as FinishedIcon } from '@element-plus/icons-vue';
  import Color from '@tiptap/extension-color';
  import { Link } from '@tiptap/extension-link';
  import { Placeholder } from '@tiptap/extension-placeholder';
  import Style from '@tiptap/extension-text-style';
  import Typography from '@tiptap/extension-typography';
  import StarterKit from '@tiptap/starter-kit';
  import { EditorContent, useEditor } from '@tiptap/vue-3';
  import { computed, onBeforeUnmount, ref, toRefs, watch } from 'vue';
  import { RiBold, RiLinkM, RiStrikethrough2 } from 'vue-remix-icons';

  defineOptions({ inheritAttrs: false });

  export interface Props extends IBaseInputProps {
    modelValue: string | null;
    editable?: boolean;
    baseUrl: string;
    references?: Priloha[];
    uploadVisible?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), { editable: true, wrapp: true, uploadVisible: true });
  const propsRef = toRefs(props);
  const { wrapp, wrappClass, span, showLabel, editable, references, uploadVisible } = propsRef;

  const showSave = ref((propsRef.modelValue.value?.length ?? 0) > 0);
  const emits = defineEmits(['update:modelValue', 'upload']);
  const base = baseInput(propsRef, emits);
  const { validationPropertyCmp, vmodel, placeholderText, labelText, isDisabled, isHiddenLabel, isListMode } = base;
  const linkId = ref<string | number | null>(null);
  const linkPopUpVisible = ref(false);

  Placeholder.configure({ placeholder: '' });
  const linkExtension = Link.configure({ openOnClick: true, autolink: false });

  const editor = useEditor({
    editable: editable.value,
    extensions: [StarterKit, linkExtension, Typography, Placeholder, Style, Color],
    content: props.modelValue,
    onUpdate: ({ editor }) => {
      emits('update:modelValue', editor.getHTML());
      showSave.value = editor.getHTML().length > 0;
    },
  });

  watch(propsRef.modelValue, (val) => {
    const isSame = editor.value?.getHTML() === val;
    if (isSame) return;
    editor.value?.commands.setContent(val, false);
  });

  function setColor(event: any) {
    editor.value?.chain().focus().setColor(event.target?.value).run();
  }

  function linkBtnClicked() {
    if (editor.value?.isActive('link')) editor.value?.commands.unsetLink();
    else linkPopUpVisible.value = true;
  }

  const isTextSelected = computed(() => {
    if (!editor.value) return false;
    const { view, state } = editor.value;
    const { from, to } = view.state.selection;
    const text = state.doc.textBetween(from, to, ' ');
    return text.length > 0;
  });

  const separator = computed(() => (propsRef.baseUrl.value.includes('?') ? '&' : '?'));
  const selectedReference = computed(() => references.value?.find((r) => r.id === linkId.value));
  const selectedHref = computed(() =>
    selectedReference.value ? `${propsRef.baseUrl.value}${separator.value}guid=${selectedReference.value.id}` : linkId.value,
  );

  function addLink() {
    if (isTextSelected.value)
      editor.value
        ?.chain()
        .focus()
        .toggleLink({ href: selectedHref.value as string, target: '_blank' })
        .run();
    else {
      const text = selectedReference.value ? selectedReference.value.celyNazev : linkId.value;
      editor.value?.commands.insertContent(`<a href="${selectedHref.value}">${text}</a>`);
    }
    linkId.value = null;
    linkPopUpVisible.value = false;
  }

  function addKomentar() {
    emits('upload');
  }
</script>

<template>
  <k-wrapper
    ref="wrapper"
    :show-label="!isHiddenLabel && showLabel"
    :disabled="isDisabled"
    :validation-property="validationPropertyCmp"
    :label="labelText"
    :wrapp="wrapp"
    :class="wrappClass"
    :span="span"
  >
    <div class="editor">
      <k-row class="jc-sb">
        <k-button-group v-if="editable">
          <input type="color" @input="setColor" :value="editor?.getAttributes('textStyle').color ?? '#000000'" class="color-picker" />
          <k-button
            :class="{ 'is-active': editor?.isActive('bold'), 'btn-tiptap': true }"
            size="small"
            @click="editor?.chain().focus().toggleBold().run()"
            :icon="RiBold"
          />
          <k-button
            :class="{ 'is-active': editor?.isActive('strike'), 'btn-tiptap': true }"
            size="small"
            @click="editor?.chain().focus().toggleStrike().run()"
            :icon="RiStrikethrough2"
          />
          <el-popover :teleported="false" v-model:visible="linkPopUpVisible" placement="top" :width="400" trigger="click" :show="linkBtnClicked">
            <template #reference>
              <k-button :class="{ 'is-active': editor?.isActive('link'), 'btn-tiptap': true }" size="small" :icon="RiLinkM" />
            </template>
            <k-row>
              <k-select
                v-model="linkId"
                :options="references ?? []"
                v-bind="{ optionsValueName: 'id', optionsTextName: 'celyNazev' }"
                filterable
                allow-create
                default-first-option
                label-key="link"
                :popper-append-to-body="false"
                :teleported="false"
              />
            </k-row>
            <div style="text-align: right; margin: 0">
              <k-button size="small" @click="linkPopUpVisible = false">cancel</k-button>
              <k-button size="small" type="primary" @click="addLink">confirm</k-button>
            </div>
          </el-popover>
        </k-button-group>
        <k-button v-show="showSave && uploadVisible" size="small" @click="addKomentar" type="success" :icon="FinishedIcon" />
      </k-row>
      <editor-content :editor="editor" class="editor__content" />
    </div>
  </k-wrapper>
</template>
