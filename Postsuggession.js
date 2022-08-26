let data = {element: "PoshTok is live"};

fetch("/post/data/here", {
  method: "POST",
  headers: {'Content-Type': 'application/json'}, 
  body: JSON.stringify(data)
}).then(res => {
  console.log("Request complete! response:", res);
});





//Or test this other one:
: messageToPost},function(response){
  if(!response || response.error){
    console.log('There was a issue in posting your emssage');
    } else {
    console.log(response.id);  
  }
});
