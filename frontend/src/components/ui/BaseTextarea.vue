<script setup>
import FieldLabel from './FieldLabel.vue'

defineProps({
  label: String,
  placeholder: String,
  rows: { type: Number, default: 4 },
})

const model = defineModel()
</script>

<template>
  <label class="block">
    <FieldLabel v-if="label">{{ label }}</FieldLabel>
    <textarea
      v-model="model"
      :rows="rows"
      :placeholder="placeholder"
      class="w-full resize-none rounded-xl bg-slate-200/70 px-4 py-3 text-slate-800 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-sb-indigo"
    />
  </label>
</template>
