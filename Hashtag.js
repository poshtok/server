//This is an Algorithm to extract hashtag from a given post caption//:

postText = 'this is a #test of #hashtags';
let regexp = /#\S+/g;
postText = postText.replace(regexp, 'REPLACED');

// g denotes that ALL hashags will be replaced in postText    
postText = postText.replace(/\b\#\w+/g, ''); 





// Using console to check:
function findHashtags(searchText) {
    let regexp = /\B\#\w\w+\b/g
    result = searchText.match(regexp);
    if (result) {
        console.log(result);
    } else {
        return false;
    }
}
find hashtags("http://www.poshtok.com/details/2022/8/8/338281#EKOHOTEL")
