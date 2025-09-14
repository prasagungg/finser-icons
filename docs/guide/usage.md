# Dasar-dasar Penggunaan

Daftarkan library sebagai plugin di file `main.ts` Anda agar komponen `SvgIcon` tersedia secara global.

```typescript
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import FinserIcons from "finser-icons";

const app = createApp(App);
app.use(FinserIcons);
app.mount("#app");
```

Setelah itu, Anda bisa langsung menggunakan komponen SvgIcon di mana saja.

```
<template>
  <SvgIcon name="general/home" class="w-8 h-8 text-blue-500" />
</template>

```
