export const routes = {
  "/": "pages/post/post.html",
  "/post": "pages/post/post.html",
  "/reports": "pages/report/report.html"
};

export const router = async () => {
  let path = location.hash.slice(1) || "/";
  if (path === "/") {
    history.replaceState({}, "", "#/post");
    path = "/post";
  }

  const route = routes[path];
  const app = document.getElementById("app");

  if (!route) {
    app.textContent = "404 - Page Not Found";
    return;
  }

  try {
    const res = await fetch(route);
    if (!res.ok) throw new Error("Failed to load");

    const html = await res.text();

    //-- parse the HTML into DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const content = document.createDocumentFragment();
    [...doc.body.childNodes].forEach(node => content.appendChild(node));

    //-- Clear existing content
    while (app.firstChild) app.removeChild(app.firstChild);

    //-- Append new nodes
    app.appendChild(content);

    const scripts = doc.querySelectorAll("script");
    scripts.forEach(oldScript => {
      const newScript = document.createElement("script");
      if (oldScript.src) {
        newScript.src = oldScript.src;
        newScript.async = oldScript.async;
        newScript.defer = oldScript.defer;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      document.body.appendChild(newScript);
    });

      // -- Load related JS module
    if (path === "/post" || path === "/reports") {
      const mod = await import(`../pages/post/post.js?t=${Date.now()}`);
      if (typeof mod.post === "function") {
        mod.post();
      }
    }

  } catch (err) {
    console.error(err);
    app.textContent = "Error loading page.";
  }
};
