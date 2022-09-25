 function base64Mime(encoded:any) {
    let mimeType = "",
    type;
  
    if (typeof encoded !== 'string') {
      return {mimeType,type};
    }
  
    var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  
    if (mime && mime.length) {
      mimeType = mime[1];
      type  = (encoded as any).match(/[^:/]\w+(?=;|,)/)[0];
  
    }
    return {mimeType,type};
  }

  export default base64Mime;