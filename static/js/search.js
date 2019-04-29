//This is called from the searchMonsterData function
function getData(url, cb) { 
    var xhr = new XMLHttpRequest();
    
    //we set onredystatechange to an anon function which tests the status of the data from the API
    xhr.onreadystatechange = function() {
        //if the ready state is 4 and the status is 200
        if (this.readyState == 4 && this.status == 200) {
            //we call our callback function in the getData call and parse is as JSON data. The data held in this.responseText
            //(xhr.responseText) is passed back into the the searchMonsterData function.
            console.log(xhr.responseText);
            cb(JSON.parse(this.responseText));
        }
    };
    
    xhr.open("GET", url);
    xhr.send();   
}

function searchMonsterData(url) {
    var searchTerm = document.getElementById("monsterName").value;
    var monsterData;
    var result;
    var monsterURL;
    
    
    //call the get data function and give it the url 
    getData(url, function(data) {
        
        monsterData = data.results;
        console.log(monsterData);

         //This snippet was found here https://stackoverflow.com/questions/46143452/get-value-from-dictionary-in-javascript-by-key
        //filter() creates an array filled with all array elements that pass a test. Here we are using a function to return the element 
        //that matches our search. It returns an array with just the name and url.
        result = monsterData.filter(function(element) {
             
            return element.name == searchTerm;                
        });
        
        if (result.length > 0) {
            //we have found a corresponding element
           monsterURL = result[0].url;
           
       }
    })

    

}