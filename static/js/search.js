function getSearch(callback) {
    var searchTerm = document.getElementById("monsterName").value;
    console.log(searchTerm);
    return searchTerm;
}

function getURL(term) {
    
    queue()
    .defer(d3.json, "http://www.dnd5eapi.co/api/monsters/")
    .await(searchData);

    function searchData(error, data) {

        //data = searchData;
        
        console.log(data);
        
        var arr = data.results;
        console.log(arr);
    
    //This snippet was found here https://stackoverflow.com/questions/46143452/get-value-from-dictionary-in-javascript-by-key
    
        var result = arr.filter(function(element) {
            return element.name == getSearch();
        });
        
        if (result.length > 0) {
             //we have found a corresponding element
            var resultURL = result[0].url;
            console.log(resultURL);
        }
    
    }

}



