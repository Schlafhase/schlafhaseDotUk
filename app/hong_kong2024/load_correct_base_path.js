var base_tag = document.getElementsByTagName("base")[0];

if (locationType() == 0) {
    base_tag.href = "file:///C:/Projects/websites/schlafhaseDotUk/app/";
}
else {
    base_tag.href = window.location.origin;
}

function locationType(){
    if( window.location.protocol == 'file:' ){ return 0; }
    if( !window.location.host.replace( /localhost|127\.0\.0\.1/i, '' ) ){ return 2; }
    return 1;
}