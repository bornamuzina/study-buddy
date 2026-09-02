<script setup>
import BaseBadge from './ui/BaseBadge.vue'
import Avatar from './ui/Avatar.vue'
import IconButton from './ui/IconButton.vue'
import { formatDatum } from '../utils/format'

const props = defineProps({
  korisnik: { type: Object, required: true },
  moj: { type: Boolean, default: false },
  odabran: { type: Boolean, default: false },
})

defineEmits(['oznaci', 'uloga', 'aktivnost', 'obrisi'])

const naslovUloge = () => {
  if (props.moj) return 'Ne možete mijenjati vlastiti račun'
  return props.korisnik.uloga === 'admin' ? 'Postavi kao studenta' : 'Postavi kao administratora'
}

const naslovAktivnosti = () => {
  if (props.moj) return 'Ne možete mijenjati vlastiti račun'
  return props.korisnik.aktivan ? 'Deaktiviraj račun' : 'Aktiviraj račun'
}
</script>

<template>
  <tr class="hover:bg-slate-50">
    <td class="px-6 py-4">
      <input
        v-if="!moj"
        type="checkbox"
        :checked="odabran"
        class="h-4 w-4 cursor-pointer"
        @change="$emit('oznaci')"
      />
    </td>

    <td class="px-6 py-4">
      <div class="flex items-center gap-3">
        <Avatar :ime="korisnik.ime" size="h-9 w-9 text-xs" />
        <div>
          <p
            class="text-sm font-semibold"
            :class="korisnik.aktivan ? 'text-slate-800' : 'text-slate-400'"
          >
            {{ korisnik.ime }}
          </p>
          <p class="text-xs text-slate-400">{{ korisnik.email }}</p>
        </div>
      </div>
    </td>

    <td class="px-6 py-4">
      <BaseBadge :color="korisnik.uloga === 'admin' ? 'amber' : 'indigo'">
        {{ korisnik.uloga === 'admin' ? 'Administrator' : 'Student' }}
      </BaseBadge>
    </td>

    <td class="px-6 py-4 text-sm text-slate-500">
      {{ formatDatum(korisnik.datumRegistracije) }}
    </td>

    <td class="px-6 py-4">
      <span
        class="flex items-center gap-2 text-sm"
        :class="korisnik.aktivan ? 'text-sb-teal' : 'text-rose-500'"
      >
        <span
          class="h-2 w-2 rounded-full"
          :class="korisnik.aktivan ? 'bg-sb-teal' : 'bg-rose-400'"
        />
        {{ korisnik.aktivan ? 'Aktivan' : 'Deaktiviran' }}
      </span>
    </td>

    <td class="px-6 py-4">
      <div class="flex justify-end gap-1">
        <IconButton name="stit" :disabled="moj" :title="naslovUloge()" @click="$emit('uloga')" />
        <IconButton
          :name="korisnik.aktivan ? 'zabrana' : 'kvacica'"
          :disabled="moj"
          :title="naslovAktivnosti()"
          @click="$emit('aktivnost')"
        />
        <IconButton
          name="kanta"
          variant="danger"
          :disabled="moj"
          :title="moj ? 'Ne možete obrisati vlastiti račun' : 'Obriši korisnika'"
          @click="$emit('obrisi')"
        />
      </div>
    </td>
  </tr>
</template>
