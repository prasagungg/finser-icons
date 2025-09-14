<script setup lang="ts">
import { defineAsyncComponent, computed, type CSSProperties } from "vue";

interface Props {
  name: string;
  size?: string | number;
}

const props = defineProps<Props>();

const toPascalCase = (str: string): string => {
  return str.replace(/(^\w|-\w)/g, (c) => c.replace("-", "").toUpperCase());
};

const iconComponentName = computed<string | null>(() => {
  if (!props.name) return null;
  const parts = props.name.split("/");
  return parts.map(toPascalCase).join("") + "Icon";
});

const dynamicIcon = defineAsyncComponent(() => {
  if (!iconComponentName.value) {
    return Promise.resolve({ render: () => null });
  }
  return import(`./icons/${iconComponentName.value}.vue`);
});
// --------------------------------------------------------------------

const iconStyle = computed<CSSProperties>(() => {
  if (props.size) {
    const sizePx = `${props.size}px`;
    return {
      width: sizePx,
      height: sizePx,
    };
  }
  return {};
});
</script>

<template>
  <component :is="dynamicIcon" class="inline-block" :style="iconStyle" />
</template>
