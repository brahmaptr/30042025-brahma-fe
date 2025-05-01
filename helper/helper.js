import store from "../../store/store.js";

export async function fetchPosts(url) {

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const posts = await res.json();
    store.setPosts(posts)
    return posts;
  }
  catch (err) {
    console.error("Failed to fetch posts:", err);
    throw err;
  }

}
