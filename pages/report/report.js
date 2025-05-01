import { fetchPosts } from "../../helper/helper.js";

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

      
      document.getElementById('totalAll').innerHTML = posts.length
      document.getElementById("loaderReport").style.display = "none";
      } catch (err) {
        listEl.innerHTML = "<li>Failed to load posts. Try again later.</li>";
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
  async countTable() {
      const reportTableContainer = document.getElementById("reportTable");

      // -- Create post counts by user
      const postCountsByUser = this.reportPost.reduce((acc, post) => {
        acc[post.userId] = (acc[post.userId] || 0) + 1;
        return acc;
      }, {});

      // -- Fetch users
      let users = [];
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        users = await response.json();
      } catch (err) {
        console.error("User fetch error:", err);
      }

      // -- Map userId to userName
      const userMap = {};
      users.forEach(user => {
        userMap[user.id] = user.name;
      });

      // -- Build table data
      const tableData = Object.entries(postCountsByUser).map(([userId, postCount]) => ({
        userId,
        userName: userMap[userId] || "Unknown",
        postCount
      }));

      // -- Create the table
      const table = document.createElement("table");
      table.className = "reportTable";

      // -- Table headers
      const headerRow = table.insertRow();
      ["User ID", "User Name", "Post Count"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
      });

      // -- Table rows
      tableData.forEach(row => {
        const tr = table.insertRow();
        tr.insertCell().textContent = row.userId;
        tr.insertCell().textContent = row.userName;
        tr.insertCell().textContent = row.postCount;
      });

      // -- Append to container
      reportTableContainer.innerHTML = "";
      reportTableContainer.appendChild(table);
    }

};

export default reportModule;
