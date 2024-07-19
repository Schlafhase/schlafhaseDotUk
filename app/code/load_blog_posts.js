var postDiv = document.getElementById("content");
var userContent = document.getElementById("userContent");
var cursorEl = document.getElementById("cursor");
posts = posts.sort(function(a, b) {return Date.parse(b.date) - Date.parse(a.date)});
posts = posts.filter((p) => {try {return p.categories.includes("Code")} catch {return false;}});
var lineNumber = 3;
var userTextLineNumber = lineNumber + (19*posts.length) + 1;
var char = 0;
var typedElement = 0;
var typedElements = document.getElementsByClassName("typed");
var cursor = " ";

var text = '<span class="transparent">\n   1 &lt!-- </span>Category: Code<span class="transparent">--&gt\n   2</span>';
postDiv.innerHTML += text;

for (var i = 0; i<posts.length; i++) {
    var post = posts[i];
    postDiv.innerHTML += post.toHtml("code", lineNumber);
    lineNumber += 19;
}

const interval = setInterval(writeNextChar, 1);
setInterval(cursorAnimation, 500);
document.addEventListener("keydown", (event) => keyboardEventHandler(event));

function writeNextChar() {
    if (typedElements[typedElement] == undefined) {
        clearInterval(interval);
    }
    var el = typedElements[typedElement];
    if (el.dataset.content[char] != undefined) {
        el.innerHTML += el.dataset.content[char];
        char += 1;
        while (el.dataset.content[char] == " ") {
            el.innerHTML += el.dataset.content[char];
            char += 1;
        }
    }
    else {
        typedElement += 1;
        char = 0;
    }
}

function cursorAnimation() {
    if (cursorEl.style.backgroundColor == "transparent") {
        cursorEl.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
    }
    else {
        cursorEl.style.backgroundColor = "transparent";
    }
}

function keyboardEventHandler(event) {
    if (event.key == "Backspace" && event.ctrlKey) {
        userContent.innerHTML = userContent.innerHTML.replace(/(\S|&lt;|&gt;|\n)+$/, '');
    }
    else if (event.key == "Backspace") {
        userContent.innerHTML = userContent.innerHTML.replace(/(.|&lt;|&gt;|\n)$/, '');
    }
    else if (event.key == "Enter") {
        userContent.innerHTML += `\n${alignLineNumberRight(userTextLineNumber)} `;
        userTextLineNumber += 1;
    }
    else if (event.key.length > 1) {
        return;
    }
    else {
        userContent.innerHTML += event.key;
    }
    window.scrollTo(0, document.getElementsByTagName("code")[0].scrollHeight);
}