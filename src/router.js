import { createRouter, createWebHashHistory } from 'vue-router'

import { getRandomSecret } from '@/utils'
import SplitView from '@/views/SplitView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'split',
      path: '/:secret([a-zA-Z0-9]{43})',
      component: SplitView,
      props: (route) => ({
        secret: route.params.secret
      })
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: {
        name: 'split',
        params: { secret: getRandomSecret() }
      }
    }
  ]
})

export default router
