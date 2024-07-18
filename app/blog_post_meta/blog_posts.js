class Post {
    constructor(date, title, description, categories, href, imgUrl) {
        this.date = new Date(date);
        this.title = title;
        this.description = description;
        this.categories = categories;
        this.href = href;
        this.imgUrl = imgUrl;
    }

    toHtml(type = "default", lineNumber = 0) {
        if (type.toLowerCase() == "code") {
            return `<a href="${this.href}"><span class="transparent">\n${lineNumber} &ltdiv class="blogUrlDiv"&gt\n${lineNumber + 1}     &lta href="${this.href}" class="blogUrl"&gt\n${lineNumber + 2}         &ltdiv class="meta"&gt\n${lineNumber + 3}             &ltspan class="date"&gt\n${lineNumber + 4}               </span>${this.date.getDate()}th ${monthToString(this.date.getMonth())}<span class="transparent">\n${lineNumber + 5}             &lt/span&gt\n${lineNumber + 6}             &ltdiv class="contentSectionHeader"&gt\n${lineNumber + 7}               </span>${this.title}<span class="transparent">\n${lineNumber + 8}             &lt/div&gt\n${lineNumber + 9}             &ltspan class="categories"&gt\n${lineNumber + 10}               </span>${tryJoin(this.categories).toUpperCase()}<span class="transparent">\n${lineNumber + 11}             &lt/span&gt\n${lineNumber + 12}             &ltp class="description"&gt\n${lineNumber + 13}               </span>${this.description}<span class="transparent">\n${lineNumber + 14}             &lt/p&gt\n${lineNumber + 15}         &lt/div&gt\n${lineNumber + 16}         &ltimg class="blogImage" src="${this.imgUrl}"&gt\n${lineNumber + 17}     &lt/a&gt\n${lineNumber + 18} &lt/div&gt</span></a>`;
        }
        return `<div class="contentSection"><div class="blogUrlDiv"><a href="${this.href}" class="blogUrl"><div class="meta"><span class="date">${this.date.getDate()}th ${monthToString(this.date.getMonth())}</span><div class="contentSectionHeader">${this.title}</div><span class="label">${tryJoin(this.categories)}</span><p class="description">${this.description}</p></div><img class="blogImage" src="${this.imgUrl}"></a></div></div>`;
    }
}

var posts = [
    new Post("2024-07-18", "Gavity", "Playing around with simulated gravity in the html canvas.", ["Code"], "gravity", "images/gravity.png")
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