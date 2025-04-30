export const routes = {
  "/": "pages/post/posts.html",
  "/post":  "pages/post/posts.html",
  "/reports":"pages/reports/reports.html"
}

export async function router() {
  const path = location.hash.slice(1) || "/";
  const route = routes[path];
  console.log("→ path:", path);
  console.log("→ route:", route);

  if (path === "/") {
    history.pushState({}, "", "#/post");
  }

  const app = document.getElementById("app");
  if (route) {
    try {
      const res = await fetch(route);
      const html = await res.text();
      app.innerHTML = html;
    } catch (err) {
      console.error(err);
      app.innerHTML = "<h1>Error loading page.</h1>";
    }
  } else {
    app.innerHTML = "<h1>404 - Page Not Found</h1>";
  }
}