import type { App } from "vue";
import SvgIcon from "./components/SvgIcon.vue";

export default {
  install: (app: App, _options?: any) => {
    app.component("SvgIcon", SvgIcon);
  },
};

export { SvgIcon };
