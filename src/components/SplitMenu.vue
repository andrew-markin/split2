<template>
  <q-menu class="bg-primary text-white">
    <q-list role="menu" style="min-width: 25ch">
      <q-item v-close-popup clickable @click="copyLink()">
        <q-item-section side>
          <q-icon name="mdi-link-variant" />
        </q-item-section>
        <q-item-section no-wrap>Copy link</q-item-section>
      </q-item>
      <q-item v-close-popup clickable @click="newSplit()">
        <q-item-section side>
          <q-icon name="mdi-open-in-new" />
        </q-item-section>
        <q-item-section no-wrap>New Split</q-item-section>
      </q-item>
      <q-item v-close-popup clickable @click="cloneSplit()">
        <q-item-section side>
          <q-icon name="mdi-content-duplicate" />
        </q-item-section>
        <q-item-section no-wrap>Clone Split</q-item-section>
      </q-item>
      <q-item v-close-popup clickable @click="toggleTheme()">
        <q-item-section side>
          <q-icon name="mdi-theme-light-dark" />
        </q-item-section>
        <q-item-section no-wrap>Toggle color theme</q-item-section>
      </q-item>
      <q-separator color="white" />
      <q-item v-close-popup clickable :href="github" target="_blank">
        <q-item-section side>
          <q-icon name="mdi-github" />
        </q-item-section>
        <q-item-section no-wrap>GitHub repository</q-item-section>
      </q-item>
      <q-item v-close-popup clickable :href="linkedin" target="_blank">
        <q-item-section side>
          <q-icon name="mdi-linkedin" />
        </q-item-section>
        <q-item-section no-wrap>LinkedIn profile</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup>
import copyToClipboard from 'copy-to-clipboard'
import { useRoute } from 'vue-router'

import { useSplit } from '@/composables/useSplit'
import { useThemes } from '@/composables/useThemes'
import { github, linkedin } from '@/links'
import router from '@/router'
import { getRandomSecret } from '@/utils'

const route = useRoute()

const { clone } = useSplit()
const themes = useThemes()

function getSplitLink(secret) {
  const route = router.resolve({ name: 'split', params: { secret } })
  return new URL(route.href, window.location.href).href
}

async function copyLink() {
  await copyToClipboard(getSplitLink(route.params.secret))
}

function newSplit() {
  window.open(getSplitLink(getRandomSecret()))
}

async function cloneSplit() {
  const secret = getRandomSecret()
  await clone(secret)
  window.open(getSplitLink(secret))
}

function toggleTheme() {
  themes.toggle()
}
</script>
