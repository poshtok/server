const getHashtags=(searchText:string)=> {
    let regexp = /\B\#\w\w+\b/g
    const result = searchText.match(regexp);
    if (result) {
     return result
    } else {
        return false;
    }
}

export default getHashtags