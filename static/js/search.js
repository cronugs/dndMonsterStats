//This is called from the searchMonsterData function
function getData(url, cb) {
    var xhr = new XMLHttpRequest();

    //we set onredystatechange to an anon function which tests the status of the data from the API
    xhr.onreadystatechange = function () {
        //if the ready state is 4 and the status is 200
        if (this.readyState == 4 && this.status == 200) {
            //we call our callback function in the getData call and parse is as JSON data. The data held in this.responseText
            //(xhr.responseText) is passed back into the the searchMonsterData function.
            //console.log(xhr.responseText);
            cb(JSON.parse(this.responseText));
        }
    };

    xhr.open("GET", url);
    xhr.send();
}

function searchMonsterData(url) {
    url = 'http://www.dnd5eapi.co/api/monsters';
    var search = document.getElementById("monsterName").value;

    //Capitalise each word in the seach term, so that it matches the data
    function titleCase(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        // Directly return the joined string
        return splitStr.join(' ');
    }


    var searchTerm = titleCase(search);
    var monsterData;
    var result;
    var monsterURL;
    var searchedMonster;
    var reg = new RegExp(searchTerm.split('').join('\\w*').replace(/\W/, ""), 'i');


    //call the get data function and give it the url 
    getData(url, function (data) {

        monsterData = data.results;
        console.log(monsterData);
        

        //write a for each loop that pushes 
        
        result = monsterData.filter(function (element) {
            if (element.name.match(reg)) {                
                return element;
            }            
        });

        if (result.length > 0) {
            //we have found a corresponding element
            resultArr = result;
            console.log(resultArr);
            monsterURL = result[0].url;
            console.log(monsterURL);
        }

        getData(monsterURL, function (data) {
            searchedMonster = data;
            displayMonster(resultArr, searchedMonster);
        })
    })
}
//getTableHeaders takes an object as a parameter, in this case it is the first result returned in our data array which contains
//an object with two key, value pairs. The keys are name and url. Which will be our table headers
function getTableHeaders(obj) {
    //create a new array to hold out table headers
    var tableHeaders = [];

    //for each key in our object 
    Object.keys(obj).forEach(function (key) {
        //push the html tags enclosing the value of our key
        tableHeaders.push(`<td>${key}</td>`);
    });
    //return the tableHeaders array, further encapsulated in <tr> tags.
    return `<tr>${tableHeaders}</tr>`;
}

function displayMonster(resultArr, searchedMonster) {
    
    //assign out incoming array to the var data
    data = resultArr;
    //declare a new variable containing an empty array for our table rows
    var tableRows = []; 
    //declare a variable to contain our targeted html element   
    var resultTable = document.getElementById("resultTable");
    //declare a variable for a table headers and pass in the getTableHeaders function with data[0] as an argument
    var tableHeaders = getTableHeaders(data[0]);
    //console.log(data);
    //console.log(data[0]);
    //console.log(searchedMonster);

    console.log(resultArr);

    resultArr.forEach(function (item) {
        var dataRow = [];

        Object.keys(item).forEach(function (key) {
            var rowData = item[key].toString();
            var truncatedData = rowData.substring(0, 50);
            dataRow.push(`<td>${truncatedData}</td>`);
        });
        tableRows.push(`<tr>${dataRow}</tr>`);
    });

    resultTable.innerHTML = `<table>${tableHeaders}${tableRows}</table>`.replace(/,/g, "");


}

/*var wrapper = $("#challenge-rating"),
        container = $('<div id="challenge-rating" class="container"></div>');
    wrapper.append(container);
    container.append('<div class="category">' + searchedMonster.challenge_rating + '</div>');

    var abilityWrapper = $("#ability-scores"),
        container = $('<div id="ability-scores" class="container"></div>');
    abilityWrapper.append(container);
    container.append('<div class="category">' + '<br>' + "Intelligence: " + searchedMonster.intelligence + '</div>');
    container.append('<div class="category">' + "Dexterity: " + searchedMonster.dexterity + '</div>');
    container.append('<div class="category">' + "Wisdom: " + searchedMonster.wisdom + '</div>');
    container.append('<div class="category">' + "Strength: " + searchedMonster.strength + '</div>');
    container.append('<div class="category">' + "Constitution: " + searchedMonster.constitution + '</div>');
    container.append('<div class="category">' + "Charisma: " + searchedMonster.charisma + '</div>');

    var specialAbilitiesWrapper = $("#special-abilities"),
        container = $('<div id="special-abilities" class="container"></div>');
    specialAbilitiesWrapper.append(container);
    container.append('<div class="category">' + '<br>' + "Special Abilities: " + searchedMonster.special_abilities[0].desc + '</div>');
    
} */








//This snippet was found here https://stackoverflow.com/questions/46143452/get-value-from-dictionary-in-javascript-by-key

//getData(monsterURL, function (data) {
//console.log(monsterURL);
//  console.log(data);
//  searchedMonster = data;
//console.log(searchedMonster);
// })