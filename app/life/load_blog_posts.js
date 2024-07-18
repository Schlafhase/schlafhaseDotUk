var postDiv = document.getElementById("posts");
var datePicker = document.getElementById("datePicker");
posts = posts.sort(function(a, b) {return Date.parse(b.date) - Date.parse(a.date)});
var currentYear = posts[0].date.getYear();
postDiv.innerHTML += getDateHeader(currentYear + 1900);
datePicker.innerHTML += getDateLink(currentYear + 1900);

for (var i = 0; i<posts.length; i++) {
    var post = posts[i];
    if (post.date.getYear() != currentYear) {
        var currentYear = post.date.getYear();
        postDiv.innerHTML += getDateHeader(currentYear + 1900);
        datePicker.innerHTML += getDateLink(currentYear + 1900);
    }
    postDiv.innerHTML += post.toHtml();
}

function getDateHeader(year) {
    return `<div class="dateHeader" id="${year}">${year}</div>`;
}

function getDateLink(year) {
    return `<a class="dateLink" href="life#${year}">${year}</a><br>`
}