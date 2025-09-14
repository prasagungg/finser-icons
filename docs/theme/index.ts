import DefaultTheme from "vitepress/theme";
import "./custom.css";

import FinserIcons from "../../src/index";

export default {
  ...DefaultTheme,
  enhanceApp({ app }: { app: import("vue").App }) {
    app.use(FinserIcons);
  },
};
