// var blogPostMetas = fs.readdirSync('/blog_post_meta/');
var blogPosts = [];

// for (var i = 0; i<blogPostMetas.length; i++) {
//     var blogPostMeta = undefined;
//     fetch('blog_post_meta/${blogPostMetas[i]}')
//         .then((res) => res.text())
//         .then((text) => blogPostMeta = JSON.parse(text))
//         .catch((e) => console.error(e));
//     blogPosts.push();
// }
fetch('../blog_post_meta/gravity.json')
        .then((res) => res.text())
        .then((text) => blogPosts.push(JSON.parse(text)))
        .catch((e) => console.error(e));

//alert(blogPosts);