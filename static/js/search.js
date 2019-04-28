//This is called from the search function

function getData(url, cb) {
    //we set a new XMLHttpRequest to the variable xhr
    var xhr = new XMLHttpRequest();

    //6. we set onredystatechange to an annon function which tests the status of the data from the API
    xhr.onreadystatechange = function() {
        //7. if the ready state is 4 and the status is 200
        if (this.readyState == 4 && this.status == 200) {
            //8. we call our callback function in the getData call and parse is as JSON data. The data held in this.responseText
            //(xhr.responseText) is passed back into the the writeToDocument function.
            cb(JSON.parse(this.responseText));
        }
    };
    //I'm not sure what these lines do!
    xhr.open("GET", url);
    xhr.send();
}

function searchForMonsterURL(url) {
    var searchTerm = document.getElementById("monsterName").value;
    //call the get data function and give it the url 
    getData(url, function(data) {
        
        data = data.results;
        console.log(data);

        var result = data.filter(function(element) {
            return element.name == searchTerm;                
        });
        
        if (result.length > 0) {
             //we have found a corresponding element
            var resultURL = result[0].url;
            console.log(resultURL);
            return resultURL;
        }
        indexRef = resultURL.substr(resultURL.lastIndexOf('/') + 1);
        console.log(indexRef);
    }) 

   // searchForMonsterURL(resultURL);
    
}



//searchForMonsterURL('http://www.dnd5eapi.co/api/monsters/');






//function getRefFromURL(term) {

    

    
     
    //queue()
    //.defer(d3.json, "static/json/monsters.json")
    //.await(searchData);

  //  function searchData(error, data) {
        
        
        
        
  //      console.log(arr);
    
    //This snippet was found here https://stackoverflow.com/questions/46143452/get-value-from-dictionary-in-javascript-by-key
    
        
  //  return indexRef;
    
//}




///function getSearch(callback) {
//    var searchTerm = document.getElementById("monsterName").value;
//    console.log(searchTerm);
//    return searchTerm;
//}