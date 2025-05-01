export const routes = {
  "/": "pages/post/post.html",
  "/post": "pages/post/post.html",
  "/reports": "pages/report/report.html"
};

export const router = async () => {
  let path = location.hash.slice(1) || "/";

  highlightActiveNav(); 
  
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
    if (path === "/post") {
      const mod = await import(`../pages/post/post.js?t=${Date.now()}`);
      const postModule = mod.default;

      if (typeof postModule.post === "function") {
        postModule.post();
      }
    } else if (path === "/reports") {
      const mod = await import(`../pages/report/report.js?t=${Date.now()}`);
      const reportModule = mod.default;

      if (typeof reportModule.report === "function") {
        reportModule.report();
      }
    }

  } catch (err) {
    console.error(err);
    app.textContent = "Error loading page.";
  }
};

export const highlightActiveNav = ()=> {
  const links = document.querySelectorAll(".navigation a");
  const currentHash = location.hash;

  links.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === currentHash);
  });
}