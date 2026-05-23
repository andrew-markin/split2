import { createRouter, createWebHashHistory } from 'vue-router'

import { getRandomSecret } from '@/utils'
import MainView from '@/views/MainView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'main',
      path: '/:secret([a-zA-Z0-9]{43})',
      component: MainView,
      props: (route) => ({
        secret: route.params.secret
      })
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: {
        name: 'main',
        params: { secret: getRandomSecret() }
      }
    }
  ]
})

export default router
