class Post {
    constructor(date, title, description, categories, href, imgUrl) {
        try {
            var arr = date.split(/[- :]/);
            this.date = new Date(Date.UTC(arr[0], arr[1]-1, arr[2], arr[3]));
        }
        catch {}
        this.date = new Date(date);
        this.title = title;
        this.description = description;
        this.categories = categories;
        this.href = href;
        this.imgUrl = imgUrl;
    }

    toHtml(type = "default", lineNumber = 0) {
        if (type.toLowerCase() == "code") {
            return `<a href="${this.href}"><span class="transparent typed" data-content='\n${alignLineNumberRight(lineNumber)} <div class="blogUrlDiv">\n${alignLineNumberRight(lineNumber + 1)}     <a href="${this.href}" class="blogUrl">\n${alignLineNumberRight(lineNumber + 2)}         <div class="meta">\n${alignLineNumberRight(lineNumber + 3)}             <span class="date">\n${alignLineNumberRight(lineNumber + 4)}               '></span><span class="typed" data-content='${this.date.getDate()}th ${monthToString(this.date.getMonth())}'></span><span class="transparent typed" data-content='\n${alignLineNumberRight(lineNumber + 5)}             </span>\n${alignLineNumberRight(lineNumber + 6)}             <div class="contentSectionHeader">\n${alignLineNumberRight(lineNumber + 7)}               '></span><span class="typed" data-content='${this.title}'></span><span class="transparent typed" data-content='\n${alignLineNumberRight(lineNumber + 8)}             </div>\n${alignLineNumberRight(lineNumber + 9)}             <span class="categories">\n${alignLineNumberRight(lineNumber + 10)}               '></span><span class="typed" data-content='${tryJoin(this.categories).toUpperCase()}'></span><span class="transparent typed" data-content='\n${alignLineNumberRight(lineNumber + 11)}             </span>\n${alignLineNumberRight(lineNumber + 12)}             <p class="description">\n${alignLineNumberRight(lineNumber + 13)}               '></span><span class="typed" data-content='${this.description}'></span><span class="transparent typed" data-content='\n${alignLineNumberRight(lineNumber + 14)}             </p>\n${alignLineNumberRight(lineNumber + 15)}         </div>\n${alignLineNumberRight(lineNumber + 16)}         <img class="blogImage" src="${this.imgUrl}">\n${alignLineNumberRight(lineNumber + 17)}     </a>\n${alignLineNumberRight(lineNumber + 18)} </div>\n${alignLineNumberRight(lineNumber + 19)} '></span></a>`;
        }
        return `<div class="contentSection"><div class="blogUrlDiv"><a href="${this.href}" class="blogUrl"><div class="meta"><span class="date">${this.date.getDate()}th ${monthToString(this.date.getMonth())}</span><div class="contentSectionHeader">${this.title}</div><span class="label">${tryJoin(this.categories)}</span><p class="description">${this.description}</p></div><img class="blogImage" src="${this.imgUrl}"></a></div></div>`;
    }
}

var posts = [
    new Post("2024-08-04", "Hong Kong 2024", "I am going to Hong Kong again!", ["Travel"], "hong_kong2024", "images/hk.png")
];

function monthToString(month) {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[month];
}

function tryJoin(arr) {
    try {
        return arr.join(", ");
    }
    catch {
        return "";
    }
}

function alignLineNumberRight(line) {
    var spaceAmount = parseInt(Math.log10(line)) * -1 + 3;
    if (spaceAmount < 0) {
        spaceAmount = 0;
    }
    return " ".repeat(spaceAmount) + line;
}