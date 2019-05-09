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
            //console.log(resultArr);
            //this takes the url of the first result and puts it in the monsterURL variable
            // *** This is a problem because we actuall want the url for each returned monster ***
            monsterURL = resultArr[0].url;
            //console.log(monsterURL);
        }

        //we call getData again, this time to return the data for an individual monster
        // *** this needs to change to take multiple urls and 
        getData(monsterURL, function (data) {
            searchedMonster = data;

            //return an array of key value pairs from searchedMonster
            //var monsterArr = Object.entries(resultArr);

            //console.log(monsterArr);
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
    var newArray = [];
    var counter = 0;
    //for each url in monsterURLList

    for (let i = 0; i < monsterURLList.length; i += 1) {
        //call getData for url and get data back
        getData(monsterURLList[i], function (data) {

            //add data to newArray 
            newArray.push(data);
            //increment counter each time newArray is pushed
            counter++;
            //when it has been pushed for each url
            if (counter === monsterURLList.length) {
                //call build tables and pass it out newArray
                //buildTables(newArray);
                populateResults(newArray);
            }   dataList = newArray;
        })
    }
}

function populateResults(combinedArray) {

    /*var select = document.getElementById("example-select");
     select.options[select.options.length] = new Option('Text 1', 'Value1');
    */
    //https://www.electrictoolbox.com/javascript-add-options-html-select/

    var select = document.getElementById("selector");
    for (index in combinedArray) {
        select.options[select.options.length] = new Option(combinedArray[index].name, index);
    }
}

var dataList = [];


function displaySelection(selector) {
    //var select = document.getElementById("selector");
    var selectedText = selector.options[selector.selectedIndex].innerHTML;
    var selectedValue = selector.value;
    //alert("selected Text: " + selectedText + " Value: " + selectedValue);
    //console.log(dataList);

    var monster;

    function logSomeData() {

        //console.log(selectedText);
        //console.log(selectedValue);
        //console.log(dataList[selectedValue].name);

        monster = dataList[selectedValue];

        console.log("Namn: " + monster.name);
        console.log("Challenge rating: " + monster.challenge_rating);
        console.log("Alignment: " + monster.alignment);
        console.log("Size: " + monster.size);
        console.log("Type: " + monster.type);
        console.log("Subtype: " + monster.subtype);
        console.log("Hit points: " + monster.hit_points);
        
        console.log("\n");
        console.log("Ability Scores");
        console.log("Strength: " + monster.strength);
        console.log("Dexterity: " + monster.dexterity);
        console.log("Intelligence: " + monster.intelligence);
        console.log("Wisdom: " + monster.wisdom);
        console.log("Charisma: " + monster.charisma);

        console.log("\n");
        console.log("Other details");
        console.log("Special ability: " + monster.special_ability);
        console.log("Damage resistances: " + monster.damage_resistances);
        console.log("Damage Immunities: " + monster.damage_immunities);
        
        
        
    } 

    logSomeData();


    //if (select.options.length > 0) {
    //    window.alert("name: " + monster.name + " challenge rating: " + monster.challenge_rating);
    //} else {
     //   window.alert("Select box is empty");
    //}
}

function buildTables(combinedArray) {

    function tableCreate() {
        //body reference 
        var body = document.getElementsByTagName("body")[0];

        // create elements <table> and a <tbody>
        var tbl = document.createElement("table");
        var tblBody = document.createElement("tbody");

        // cells creation
        for (var j = 0; j <= combinedArray.length; j++) {
            // table row creation
            var row = document.createElement("tr");

            for (var i = 0; i < 2; i++) {
                // create element <td> and text node 
                //Make text node the contents of <td> element
                // put <td> at end of the table row
                var cell = document.createElement("td");
                var cellText = document.createTextNode("cell is row " + j + ", column " + i);

                cell.appendChild(cellText);
                row.appendChild(cell);
            }

            //row added to end of table body
            tblBody.appendChild(row);
        }

        // append the <tbody> inside the <table>
        tbl.appendChild(tblBody);
        // put <table> in the <body>
        body.appendChild(tbl);
        // tbl border attribute to 
        tbl.setAttribute("border", "2");
    }

    tableCreate();


    //just playing around with the data
    console.log("name: " + monster.name);
    console.log("challenge rating: " + monster.challenge_rating);
    console.log("Size: " + monster.size);
    console.log("Hit points: " + monster.hit_points);
    console.log("\n");
    console.log("Ability Scores");
    console.log("Strength: " + monster.strength);
    console.log("Dexterity: " + monster.dexterity);
    console.log("Intelligence: " + monster.intelligence);
    console.log("Wisdom: " + monster.wisdom);
    console.log("Charisma: " + monster.charisma);

    console.log("\n");
    console.log("Other details");
    console.log("Special ability: " + monster.special_ability);
}