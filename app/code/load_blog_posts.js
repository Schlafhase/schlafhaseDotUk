var postDiv = document.getElementById("content");
posts = posts.sort(function(a, b) {return Date.parse(b.date) - Date.parse(a.date)});
posts = posts.filter((p) => p.categories.includes("Code"))
var lineNumber = 3;

for (var i = 0; i<posts.length; i++) {
    var post = posts[i];
    postDiv.innerHTML += post.toHtml("code", lineNumber);
    lineNumber += 18;
}