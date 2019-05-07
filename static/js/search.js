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

        //monster data is an array of key value objects with the name and url for each monster
        monsterData = data.results;
        console.log(monsterData);

        //here we use our regex to match the search string to names of monsters and return matching elements
        result = monsterData.filter(function (element) {
            if (element.name.match(reg)) {
                return element;
            }
        });

        //we have found corresponding elements
        if (result.length > 0) {
            //create a new variable for our result array. It contains an array of name url key value pairs for monsters that match
            //our search
            resultArr = result;
            console.log(resultArr);
            //this takes the url of the first result and puts it in the monsterURL variable
            // *** This is a problem because we actuall want the url for each returned monster ***
            monsterURL = resultArr[0].url;
            console.log(monsterURL);
        }

        //we call getData again, this time to return the data for an individual monster
        // *** this needs to change to take multiple urls and 
        getData(monsterURL, function (data) {
            searchedMonster = data;

            //return an array of key value pairs from searchedMonster
            var monsterArr = Object.entries(resultArr);

            console.log(monsterArr);
            console.log(resultArr);
            //console.log(searchedMonster);       

            //create an array containing the URLS from resultArr
            function listOfURLS(mons) {
                let URL_list = [];
                for (let i = 0; i < mons.length; i += 1) {
                    URL_list.push(mons[i].url);
                }
                return URL_list;
            }

            //console.log(listOfURLS(resultArr));

            displayMonster(resultArr, listOfURLS(resultArr));
        })
    })
}

//getTableHeaders takes an object as a parameter, in this case it is the first result returned in our data array which contains
//an object with two key, value pairs. The keys are name and url. Which will be our table headers
function getTableHeaders(obj) {
    //create a new array to hold out table headers
    var tableHeaders = [];

    var keys = Object.keys(obj)[0];
    console.log(keys);

    //for each key in our object 
    //Object.keys(obj).forEach(function (key) {
    //push the html tags enclosing the value of our key
    tableHeaders.push(`<td>${keys}</td>`);
    //});
    //return the tableHeaders array, further encapsulated in <tr> tags.
    return `<tr>${tableHeaders}</tr>`;
}

function displayMonster(resultArr, monsterURLList) {

    //declare a new variable containing an empty array for our table rows
    var tableRows = [];
    //console.log(monsterURLList[0]);

    for (let i = 0; i < monsterURLList.length; i += 1) {
        getData(monsterURLList[i], function (data) {
            var individualMonsters = [];
            individualMonsters.push(data)
            console.log(individualMonsters);
        })
    }
    //declare a variable to contain our targeted html element   
    var resultTable = document.getElementById("resultTable");
    //declare a variable for a table headers and pass in the getTableHeaders function with data[0] as an argument
    var tableHeaders = getTableHeaders(resultArr[0]);

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