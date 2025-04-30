import { router } from "./helper/router.js";

console.log("App initialized!");

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);