import { fetchPosts } from "../../helper/helper.js";

const postModule = {

  //module state-----------------
  initialPost: [],
  activePost: [],
  pagination: {
    page: 1,
    skip: 5,
    content: [],
  },
  searchValue: "",

  //post retrieve-----------------
  async post() {
    const listEl = document.getElementById("postList");
    if (!listEl) return console.error("#postList container not found");

    try {   
      const posts = await fetchPosts("https://jsonplaceholder.typicode.com/posts");

      this.initialPost = posts;
      this.activePost = posts;
      this.pagination.page = 1;

      this.paginate();
      this.renderPost();

      document.getElementById("loader").style.display = "none";
    } catch (err) {
      listEl.contentText = "Failed to load posts. Try again later.";
    }

    const selectEl = document.getElementById("mySelect");
    if (selectEl) {
      selectEl.addEventListener("input", this.handleChange.bind(this));
    }

     const itemsPerPage = document.getElementById("itemsPerPage");
    if (itemsPerPage) {
      itemsPerPage.addEventListener("input", this.handleChangeItemsPerPage.bind(this));
    }
  },
  
   //render post list-----------------
  renderPost() {
    const fragment = document.createDocumentFragment();
    const posts = this.pagination.content;
    posts.forEach((post) => {
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
       li.addEventListener("click", () => {
          this.showData(post)
       });
      
    });

    const listEl = document.getElementById("postList");
    listEl.innerHTML = "";
    listEl.appendChild(fragment);

    this.renderPaginationControls();
  },

  //calculate pagination--------------
  paginate() {
    const { page, skip } = this.pagination;
    const start = (page - 1) * skip;
    const end = start + skip;

    this.pagination.content = this.activePost.slice(start, end);
  },

  //highlighting 'rerum' and searched text----------------
  highlightCombined(text) {
    const keywords = ["rerum"];
    if (this.searchValue.length > 1) {
      keywords.push(this.searchValue.toLowerCase());
    }

    const uniqueWords = [...new Set(keywords)].filter(Boolean);

    if (uniqueWords.length === 0) return text;

    const regex = new RegExp(`(${uniqueWords.join("|")})`, "gi");

    return text.replace(regex, (match) => {
      const lower = match.toLowerCase();
      if (lower === "rerum") {
        return `<span class="highlight">${match}</span>`;
      } else {
        return `<span class="highlightSearch">${match}</span>`;
      }
    });
  },

  //Pagination control----------------------
  renderPaginationControls() {
    const container = document.getElementById("pagination");
    if (!container) return;

    const totalPages = Math.ceil(this.activePost.length / this.pagination.skip);
    const currentPage = this.pagination.page;

    const dataNotFound = document.getElementById('dataNotFound')

    if (totalPages === 0) {
      container.style.display = 'none'
      dataNotFound.textContent = `Data not found.`
    } else {
      container.style.display = 'flex'
      dataNotFound.textContent = ''
    }

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
        (i === 2 && currentPage > 3) ||
        (i === totalPages - 1 && currentPage < totalPages - 2)
      ) {
        container.appendChild(document.createTextNode("..."));
      }
    }
    container.appendChild(createButton("NEXT", currentPage + 1, currentPage === totalPages));
  },

  //handle Search------------------------------
  handleChange(event) {
    this.searchValue = event?.target?.value?.toLowerCase() || "";

    const searchText = document.getElementById('searchText')
    searchText.innerHTML = 'Showing results for - <b>' + this.searchValue + ':</b>'

    if (this.searchValue === '') {
      searchText.textContent = ''
    }
    
    const filtered = this.initialPost.filter(
      (post) =>
        post.title.toLowerCase().includes(this.searchValue) ||
        post.body.toLowerCase().includes(this.searchValue)
    );

    this.activePost = filtered;
    this.pagination.page = 1;
    this.paginate();
    this.renderPost();
  },

  handleChangeItemsPerPage(event) {
    this.pagination.page = 1;
    this.pagination.skip = event.target.value
    this.paginate();
    this.renderPost();
  },
  
  
  //Showing Detail data with comments on post click--------------------------
  async showData(data) {
    const dialogEl = document.getElementById('dialog');
    const dialogContent = document.getElementById('dialogContent');

    
    dialogContent.textContent = '';
    
      const postContainer = document.createElement('div');
      postContainer.classList.add('post');

      const title = document.createElement('h2');
      title.classList.add('postTitle');
      title.textContent = data.title;

      const body = document.createElement('p');
      body.classList.add('postBody');
      body.innerHTML = data.body.replace(/\n/g, '<br>');
      
      const commentArea = document.createElement('div');
      commentArea.classList.add('commentArea');
      commentArea.textContent = 'Comment:'
      
      const closeButton = document.createElement('button');
      closeButton.classList.add('closeButton');
      closeButton.textContent = 'CLOSE'

      postContainer.appendChild(title);
      postContainer.appendChild(body);
      postContainer.appendChild(commentArea);
      postContainer.appendChild(closeButton);

      dialogContent.appendChild(postContainer);

      dialogEl.style.display = 'flex';
      // need improvement ------ 
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${data.id}`);
        const comments = await res.json();

        if (comments.length > 0) {
          commentArea.innerHTML = '<strong>Comments:</strong><br><br>';
          comments.forEach(comment => {
            const commentBlock = document.createElement('div');
            commentBlock.classList.add('comment');
            commentBlock.innerHTML = `
              <p><strong>${comment.name}</strong><br> ${comment.email}</p>
              <p class='commentText'>${comment.body.replace(/\n/g, '<br>')}</p>`;
            commentArea.appendChild(commentBlock);
          });
        } else {
          commentArea.innerHTML = 'No comments found.';
        }
      } catch (error) {
        commentArea.textContent = 'Failed to load comments.';
        console.error('Error fetching comments:', error);
    }
    
      closeButton.addEventListener('click', () => {
        dialogEl.style.display = 'none';
      });
  },
};

export default postModule;
