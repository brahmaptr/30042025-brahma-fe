const postModule = {
  initialPost:[],
  activePost: [],
  pagination: {
    page: 1,
    skip:5,
    content:[]
  },
  searchValue : '',
  async post() {
    const listEl = document.getElementById("post-list");
    if (!listEl) return console.error("#post-list container not found");

    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const posts = await res.json();
      
      this.initialPost = posts;
      this.activePost = posts;
      this.pagination.page = 1;
      this.paginate();
      this.renderPost();

      postModule.renderPost()
    } catch (err) {
      console.error("Failed to load posts:", err);
      
      listEl.innerHTML = "<li>Failed to load posts. Try again later.</li>";
    }

    const selectEl = document.getElementById("mySelect");

    if (selectEl) {
      selectEl.addEventListener("input", this.handleChange.bind(this));
    }
  },
  renderPost() {
    const fragment = document.createDocumentFragment();

    const posts = this.pagination.content;
    posts.forEach(post => {
      const li = document.createElement("li");
      li.classList.add("pageContainer-content__item");

      const h3 = document.createElement("div");
      h3.classList.add("pageContainer-content__item-title");
      h3.innerHTML = this.highlightCombined(post.title);

      const p = document.createElement("p");
      p.classList.add("pageContainer-content__item-desc");
      p.innerHTML = this.highlightCombined(post.body);

      li.append(h3, p);
      fragment.appendChild(li);
    });

    const listEl = document.getElementById("post-list");
    listEl.innerHTML = "";
    listEl.appendChild(fragment);

    this.renderPaginationControls();
  },
  paginate() {
    const { page, skip } = this.pagination;
    const start = (page - 1) * skip;
    const end = start + skip;

    this.pagination.content = this.activePost.slice(start, end);
  },


  highlightCombined(text) {
    const keywords = ['rerum'];
    if (this.searchValue.length > 1) {
      keywords.push(this.searchValue.toLowerCase()); 
    }

    const uniqueWords = [...new Set(keywords)].filter(Boolean);

    if (uniqueWords.length === 0) return text;

    const regex = new RegExp(`(${uniqueWords.join('|')})`, 'gi');

    return text.replace(regex, match => {
      const lower = match.toLowerCase();
      if (lower === 'rerum') {
        return `<span class="highlight">${match}</span>`;
      } else {
        return `<span class="highlightSearch">${match}</span>`;
      }
    });
  },
  renderPaginationControls() {
    const container = document.getElementById("pagination");
    if (!container) return;

    const totalPages = Math.ceil(this.activePost.length / this.pagination.skip);
    const currentPage = this.pagination.page;

    container.innerHTML = "";

    const createButton = (text, page, disabled = false, isActive = false) => {
      const btn = document.createElement("button");
      btn.textContent = text;
      btn.disabled = disabled;
      btn.className = isActive ? "active-page" : "";
      btn.onclick = () => {
        this.pagination.page = page;
        this.paginate();
        this.renderPost();
      };
      return btn;
      };
      
    container.appendChild(createButton("PREV", currentPage - 1, currentPage === 1));

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        Math.abs(i - currentPage) <= 1
      ) {
        container.appendChild(createButton(i, i, false, i === currentPage));
      } else if (
        i === 2 && currentPage > 3 || 
        i === totalPages - 1 && currentPage < totalPages - 2
      ) {
        container.appendChild(document.createTextNode("..."));
      }
    }
    container.appendChild(createButton("NEXT", currentPage + 1, currentPage === totalPages));
  },


  
  handleChange(event) {
    
    this.searchValue = event?.target?.value?.toLowerCase() || "";

    const filtered = this.initialPost.filter(post =>
      post.title.toLowerCase().includes(this.searchValue) ||
      post.body.toLowerCase().includes(this.searchValue)
    );

    this.activePost = filtered;
    this.pagination.page = 1;
    this.paginate();
    this.renderPost();

  }
};

export default postModule;
