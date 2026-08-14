import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/projects',
      name: 'projects',
      // 使用动态导入实现懒加载，并添加预取提示
      component: () => import('../views/ProjectsView.vue'),
    },
    {
      path: '/project/:slug',
      name: 'project-detail',
      component: () => import('../views/ProjectDetailView.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogView.vue'),
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: () => import('../views/BlogPostView.vue'),
    },
    {
      path: '/blog/new',
      name: 'new-post',
      component: () => import('../views/PostEditorView.vue'),
    },
    {
      path: '/blog/edit/:id',
      name: 'edit-post',
      component: () => import('../views/PostEditorView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/snishaper',
      name: 'snishaper',
      component: () => import('../views/SniShaperView.vue'),
    },
    {
      path: '/lumine',
      name: 'lumine',
      component: () => import('../views/LumineView.vue'),
    },
    {
      path: '/tests',
      name: 'tests',
      component: () => import('../views/TestsView.vue'),
    },
    {
      path: '/emergency',
      name: 'emergency',
      component: () => import('../views/EmergencyView.vue'),
    },
    {
      path: '/tests/mbti',
      name: 'mbti',
      component: () => import('../views/MbtiView.vue'),
    },
    {
      path: '/tests/substance',
      name: 'substance',
      component: () => import('../views/SubstanceView.vue'),
    },
    {
      path: '/tests/:testId',
      name: 'test-page',
      component: () => import('../views/TestPageView.vue'),
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthTestView.vue'),
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('../views/AuthCallbackView.vue'),
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/ResetPasswordView.vue'),
    },
    {
      path: '/user/:userId',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyView.vue'),
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/TermsView.vue'),
    },
    // 404 页面 - 必须放在最后
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
