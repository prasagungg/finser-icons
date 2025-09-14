// docs/.vitepress/config.ts
import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Finser Icons",
  description: "A beautiful icon library for Vue 3.",

  themeConfig: {
    logo: "/logo.svg",

    nav: [
      { text: "Panduan", link: "/guide/getting-started" },
      { text: "Daftar Ikon", link: "/icons" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Pendahuluan",
          items: [
            { text: "Memulai", link: "/guide/getting-started" },
            { text: "Instalasi", link: "/guide/installation" },
          ],
        },
        {
          text: "Penggunaan",
          items: [{ text: "Dasar-dasar", link: "/guide/usage" }],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/username/repo-anda" },
    ],
  },
});
