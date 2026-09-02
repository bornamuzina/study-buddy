<script setup>
import Icon from './Icon.vue'
import FieldLabel from './FieldLabel.vue'

defineProps({
  options: { type: Array, required: true },
  label: String,
  disabled: { type: Boolean, default: false },
})

const model = defineModel()
</script>

<template>
  <label class="inline-block max-w-full">
    <FieldLabel v-if="label">{{ label }}</FieldLabel>
    <span class="relative block">
      <select
        v-model="model"
        :disabled="disabled"
        class="w-full cursor-pointer appearance-none rounded-xl bg-slate-200/70 py-2.5 pr-11 pl-4 text-sm text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-sb-indigo disabled:cursor-default disabled:opacity-60"
      >
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <Icon
        name="desno"
        size="h-4 w-4"
        class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 rotate-90 text-slate-500"
      />
    </span>
  </label>
</template>
