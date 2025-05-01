import { router } from "./router/router.js";

import store from "./store/store.js";

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);
