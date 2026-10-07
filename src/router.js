import { createRouter, createWebHashHistory } from 'vue-router'

import { getRandomSecret, getSecretVersion } from '@/utils'
import SplitView from '@/views/SplitView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'split',
      path: '/:secret([a-zA-Z0-9]{44})',
      component: SplitView,
      props: (route) => ({
        secret: route.params.secret
      })
    },
    {
      path: '/:key([a-zA-Z0-9]{43})',
      redirect: (to) => {
        window.location.replace(`https://split-one.mayfleet.com/#/${to.params.key}`)
        return ''
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: () => ({
        name: 'split',
        params: { secret: getRandomSecret() }
      })
    }
  ]
})

router.beforeEach((to) => {
  if (to.name !== 'split') return
  if (getSecretVersion(to.params.secret) === 2) return
  return { name: 'split', params: { secret: getRandomSecret() } }
})

export default router
