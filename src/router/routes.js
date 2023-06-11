const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue") },
      {
        path: "gestionar-eventos",
        component: () =>
          import("pages/gestionarTipoEventos/listarTipoEventos.vue"),
      },
      {
        path: "gestionar-locales",
        component: () => import("pages/gestionarLocales/listarLocales.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
