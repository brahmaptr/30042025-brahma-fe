import { fetchPosts } from "../../helper/helper.js"; // Import the helper
const reportModule = {
  reportPost:[],
  async report() {
    try {   
      const posts = await fetchPosts("https://jsonplaceholder.typicode.com/posts");
      this.reportPost = posts
      this.countRerum()
      this.countRerumTitle()
      this.countRerumAll()
      this.countTable()
      } catch (err) {
        //listEl.innerHTML = "<li>Failed to load posts. Try again later.</li>";
      }
  },
  countRerum() {
    const countRerumInBody = this.reportPost.filter(post => post.body.toLowerCase().includes("rerum")).length;
    document.getElementById('totalRerum').innerHTML = countRerumInBody
    console.log(countRerumInBody)
  },
  countRerumTitle() {
    const countRerumInBody = this.reportPost.filter(post => post.title.toLowerCase().includes("rerum")).length;
    document.getElementById('totalRerumTitle').innerHTML = countRerumInBody
    console.log(countRerumInBody)
  },
  countRerumAll() {
    const count = this.reportPost.filter(post => 
      post.title.toLowerCase().includes("rerum") || post.body.toLowerCase().includes("rerum")
    ).length;

    document.getElementById('totalRerumAll').innerHTML = count;
    console.log(count);
  },
  countTable() {
      const reportTableContainer = document.getElementById("reportTable");

      const postCountsByUser = this.reportPost.reduce((acc, post) => {
        acc[post.userId] = (acc[post.userId] || 0) + 1;
        return acc;
      }, {});

      const tableData = Object.entries(postCountsByUser).map(([userId, postCount]) => ({
        userId,
        postCount
      }));

      // -- Create the table element
      const table = document.createElement("table");
      table.className = "reportTable"; // Optional: for CSS styling

      // -- Create table header
      const headerRow = table.insertRow();
      ["User ID", "Post Count"].forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
      });

      // -- Insert data rows
      tableData.forEach(row => {
        const tr = table.insertRow();
        const tdUserId = tr.insertCell();
        tdUserId.textContent = row.userId;
        const tdPostCount = tr.insertCell();
        tdPostCount.textContent = row.postCount;
      });

      // -- Append table to container
      reportTableContainer.innerHTML = "";
      reportTableContainer.appendChild(table);

  }
};

export default reportModule;
