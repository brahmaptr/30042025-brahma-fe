export async function post() {

  console.log("Hello")
  const listEl = document.getElementById("post-list");
  if (!listEl) return console.error("#post-list container not found");

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const posts = await res.json();

    const fragment = document.createDocumentFragment();
    posts.forEach(post => {
      const li = document.createElement("li");
      const h3 = document.createElement("h3");
      h3.textContent = post.title;
      const p = document.createElement("p");
      p.textContent = post.body;
      li.append(h3, p);
      fragment.appendChild(li);
    });


    listEl.innerHTML = "";
    listEl.appendChild(fragment);
  } catch (err) {
    console.error("Failed to load posts:", err);
    listEl.innerHTML = "<li>Failed to load posts. Try again later.</li>";
  }
}