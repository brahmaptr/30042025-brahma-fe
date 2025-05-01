const store = {
  posts: [],
  setPosts(data) {
    this.posts = data;
  },
  getPosts() {
    return this.posts;
  }
};

export default store;
