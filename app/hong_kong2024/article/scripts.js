const paragraphs = document.getElementsByClassName("paragraph");

window.addEventListener("resize", splitParagraphs);
window.addEventListener("DOMContentLoaded", splitParagraphs);
//TODO: ADD LEFT ALIGNED IMAGES
function splitParagraphs() {
    for (var i=0; i<paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        paragraph.classList.remove("grid");
        var content = [];
        var divs = paragraph.querySelectorAll("div");
        for (var div of divs) {
            var child = div.firstChild;
            while (child) {
                if (child.nodeType == 3) {
                    content.push(child.data);
                }
                child = child.nextSibling;
            }
        }
        content = content.join("");
        const images = paragraph.querySelectorAll(".image");
        var height = paragraph.clientHeight;
        for (var image of images) {
            height -= image.clientHeight;
        }
        var lines = (height/getLineHeight(paragraph))*2.0661;
        var imageLines = 0;
        for (var image of images) {
            imageLines += (image.clientHeight/3.4)/getLineHeight(paragraph);
        }
        lines += imageLines;
        const firstHalf = returnNLines(content, lines/2);
        const secondHalf = content.substring(firstHalf.length-1);
        const firstDiv = document.createElement("div");
        firstDiv.innerHTML = firstHalf;
        const secDiv = document.createElement("div");
        secDiv.innerHTML = secondHalf;
        paragraph.innerHTML = "";
        paragraph.appendChild(firstDiv);
        paragraph.appendChild(secDiv);
        paragraph.classList.add("grid");
        for (var image of images) {
            paragraph.childNodes[1].appendChild(image);
        }
    }
}

function getLineHeight(el) {
    var temp = document.createElement(el.nodeName), ret;
    temp.setAttribute("style", "margin:0; padding:0; "
        + "font-family:" + (el.style.fontFamily || "inherit") + "; "
        + "font-size:" + (el.style.fontSize || "inherit"));
    temp.innerHTML = "A";

    el.parentNode.appendChild(temp);
    ret = temp.clientHeight;
    temp.parentNode.removeChild(temp);

    return ret;
}

function returnNLines(text, lines) {
    const cpw = measureCharacterPerWidth(paragraphs[0]);
    const words = text.split(" ");
    var result = "";
    var lineCount = 0;
    var charCount = 0;
    var i = 0;
    while (lineCount<lines) {
        if (i>=words.length) {
            break;
        }
        // if (words[i] == "" || words[i] == "\n") {
        //     i++;
        //     continue;
        // }
        result += words[i] + " ";
        charCount += words[i].length+1;
        i++;
        if (charCount > cpw*(paragraphs[0].clientWidth/2.0661)) {
            lineCount++;
            i--;
            result = result.substring(0, result.length-words[i].length-1);
            charCount = 0;
        }
    }
    return result;
}

function measureCharacterPerWidth(el) {
    var temp = document.createElement(el.nodeName), ret;
    temp.setAttribute("style", "margin:0; padding:0; position:absolute; overflow: hidden; text-wrap: nowrap; font-size: larger;");
    temp.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut elit ac mi feugiat cursus tristique vitae augue. Praesent condimentum mi egestas neque imperdiet mollis. Ut porta tincidunt augue et auctor. Vestibulum tempus, erat luctus euismod accumsan, diam magna consequat libero, sodales commodo ex enim non lacus. Aenean sed efficitur est. Nunc euismod mauris id elit vulputate, a faucibus augue semper. Cras vel neque in elit vulputate egestas eget aliquet lacus. Duis eget dignissim ante. Nam ut consequat justo. Suspendisse a diam vel ipsum porttitor iaculis vitae sed sem. Maecenas eget sem sed arcu dapibus tempus a nec dui. Curabitur mattis sed risus ut pulvinar. Nam nunc dolor, laoreet id neque ac, rutrum faucibus sapien. Ut massa quam, iaculis et turpis sit amet, blandit ullamcorper felis. Sed iaculis blandit accumsan. Aliquam id accumsan felis. Aenean vitae elit gravida, lobortis orci eget, pellentesque elit. Fusce quis purus metus. In vel nulla a nunc iaculis rhoncus ut ac est. Sed condimentum gravida laoreet. Aliquam pellentesque consequat neque, sed congue mi sollicitudin quis. Fusce ultricies euismod lobortis. Sed a augue vitae enim tincidunt lobortis. Phasellus ut magna at massa condimentum tempor id non justo. Vestibulum imperdiet facilisis tortor, ac congue tellus interdum vitae. Quisque varius at odio non accumsan. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum et est id lectus egestas tristique a at tortor. Praesent lacinia at eros vitae euismod. Ut ac tortor justo. Curabitur gravida venenatis sapien quis lacinia. Etiam maximus viverra congue. Curabitur non facilisis leo. Vivamus purus ante, fermentum quis orci ac, sodales blandit quam. Pellentesque at consequat nisi. Morbi dapibus vehicula ante, id dictum quam lobortis vitae. Aenean ultricies nulla quam, sit amet mattis nulla cursus eu. Integer enim dui, rhoncus vel sem sed, lacinia finibus arcu. Vivamus sit amet eros ante. Vestibulum erat nisi, consequat ut tempor sed, dictum blandit nibh. Nulla commodo libero metus, a lobortis eros pharetra sit amet. Proin varius, quam ac pharetra condimentum, justo mi pulvinar nulla, vitae consequat purus magna non leo. Aenean dolor magna, luctus fringilla sem in, ullamcorper suscipit magna. Nullam lorem lacus, sagittis sit amet arcu eu, volutpat tincidunt lacus. Cras eu mauris convallis, rutrum nibh eu, porta ante. Ut sed facilisis dui. Sed at tristique lectus. Fusce neque mi, accumsan vel rutrum at, imperdiet nec mi. Sed vulputate libero vel lorem eleifend, quis semper neque mollis. Morbi et interdum tellus. Proin blandit odio massa, non semper tortor sodales eget. Donec eleifend luctus ipsum, vitae ornare ligula. Nunc vehicula sollicitudin velit ac eleifend. Maecenas feugiat auctor velit at mollis. Nullam vehicula, est ut laoreet dapibus, quam elit vehicula felis, vitae porta nisi magna sed justo. Proin eu diam a ligula accumsan semper at quis enim. Curabitur nisl lectus, tristique vitae purus vitae, porta imperdiet enim. Praesent facilisis posuere mollis. Vivamus vitae commodo risus, et pharetra nulla. Aliquam mi nulla, sollicitudin sed nibh id, egestas mattis libero. Curabitur porta tellus vel lectus ultrices, faucibus tincidunt lacus interdum. Sed id est ante. In quam diam, bibendum in.";

    document.body.appendChild(temp);
    ret = temp.innerHTML.length/temp.clientWidth;
    temp.parentNode.removeChild(temp);

    return ret;
}