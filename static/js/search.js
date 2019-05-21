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

// A quick snippet of text so pressing enter triggers the search box
$(document).ready(function () {
    $('#monsterName').keypress(function (e) {
        if (e.keyCode == 13)
            $('#search-button').click();
    });
});

// this variable is used for the displaySelection() function to know which layout to render
var searchType;
url = 'http://www.dnd5eapi.co/api/monsters';

//set the searchType variable and set the url to point to monsters or spells with the select box
function categorySelect() {
    var category = document.getElementById("category-dropdown").value;
    if (category == "spell") {
        url = 'http://www.dnd5eapi.co/api/spells';
        searchType = 'spells';

        console.log(searchType);
    } else {
        url = 'http://www.dnd5eapi.co/api/monsters';
        searchType = 'monsters';
        console.log(searchType);
    }
}

function searchMonsterData() {

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

            //console.log(monsterArr);
            console.log(resultArr);

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
    //var tableRows = [];
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
            }
            dataList = newArray;

        })
    }
}

//combinedArray is the result of code to this point. It is an array of objects containing monster data for each of the 
//monsters that matched our search term.
//populate results takes 
function populateResults(combinedArray) {

    console.log(combinedArray);
    /*var select = document.getElementById("example-select");
     select.options[select.options.length] = new Option('Text 1', 'Value1');
    */
    //https://www.electrictoolbox.com/javascript-add-options-html-select/

    var select = document.getElementById("selector");
    select.style.display = "block";
    //make sure the list is clear first
    removeOptions(select);

    //for each object in combinedArray create a new list item object with index.name and index as args
    for (index in combinedArray) {
        console.log(select.options.length);
        select.options[select.options.length] = new Option(combinedArray[index].name, index);
    }
}

var dataList = [];

//here we have function to interate through out dropdown HTML element and remove the contents.
function removeOptions(selectbox) {

    var i;
    for (i = selectbox.options.length - 1; i >= 0; i--) {
        selectbox.remove(i);
    }
}

var monster;

function displaySelection(selector) {

    function createMonsterLayout() {

        //clear card first and then dynamically create the elements needed.
        $(".card").empty();

        var newSpan = $('<span/>', {
            'class': 'ability-headings',
            id: 'monster-name'
        });

        var statDiv = $('<div/>', {
            'class': 'feature-block',
            id: 'general-stats'
        });

        var statDiv2 = $('<div/>', {
            'class': 'feature-block',
            id: 'more-stats'
        });

        var newCanvas = $('<canvas/>', {
            'class': 'graphCanvas',
            id: 'cvs'
        }).prop({
            width: 300,
            height: 200
        });

        var statDiv3 = $('<div/>', {
            'class': 'feature-block',
            id: 'more-stats1'
        });

        var statDiv4 = $('<div/>', {
            'class': 'feature-block',
            id: 'more-stats2'
        });

        $('.card').append(newSpan);
        $('.card').append(statDiv);
        $('.card').append(statDiv2);
        $('.card').append(newCanvas);
        $('.card').append(statDiv3);
        $('.card').append(statDiv4);

        var selectedText = selector.options[selector.selectedIndex].innerHTML;
        var selectedValue = selector.value;

        function logSomeData() {

            monster = dataList[selectedValue];

            /////////////////////////////////////////////////////////
            //add some stuff to the page
            /////////////////////////////////////////////////////////
            $("#monster-name").append(`${monster.name}`);
            $("#general-stats").append(`Alignment: ${monster.alignment}<br />`);
            $("#general-stats").append(`Type: ${monster.type}<br />`);
            $("#general-stats").append(`Size: ${monster.size}<br />`);

            $("#more-stats").append(`Challenge rating: ${monster.challenge_rating}<br />`);
            $("#more-stats").append(`Hit points: ${monster.hit_points} <br />`);
            $("#more-stats").append(`Armor Class: ${monster.armor_class}<br />`);

            $("#more-stats1").append(`Languages: ${monster.languages}<br />`);
            $("#more-stats1").append(`Damage_Immunities: ${monster.damage_immunities} <br />`);
            $("#more-stats1").append(`Senses: ${monster.senses}<br />`);

            $("#more-stats2").append(`Speed: ${monster.speed}<br />`);
            $("#more-stats2").append(`Wisdom save: ${monster.wisdom_save} <br />`);
            $("#more-stats2").append(`Charisma Save: ${monster.charisma_save}<br />`);



            //$("#general-stats").append(`Subtype: ${monster.subtype}<br />`);



            // $("#ability-scores").append(`Strength: ${monster.strength}<br />`);
            // $("#ability-scores").append(`Dexterity: ${monster.dexterity}<br />`);
            // $("#ability-scores").append(`Intelligence: ${monster.intelligence}<br />`);
            // $("#ability-scores").append(`Wisdom: ${monster.wisdom}<br />`);
            // $("#ability-scores").append(`Charisma: ${monster.charisma}<br />`);
            // $("#ability-scores").append(`Consitution: ${monster.constitution}<br />`);


        }

        logSomeData();
        statSpiderGraph();

    }

    function createSpellLayout() {

        //clear card first and then dynamically create the elements needed.
        $(".card").empty();

        var titleSpan = $('<span/>', {
            'class': 'ability-headings',
            id: 'spell-name'
        });

        var statDiv = $('<div/>', {
            'class': 'feature-block',
            id: 'general-stats'
        });

        var statDiv2 = $('<div/>', {
            'class': 'feature-block',
            id: 'more-stats'
        });

        var statDiv3 = $('<div/>', {
            'class': 'feature-block',
            id: 'class-can-use'
        });

        var statDiv4 = $('<div/>', {
            'class': 'description-block',
            id: 'spell-description'
        });

        $('.card').append(titleSpan);
        $('.card').append(statDiv);
        $('.card').append(statDiv2);
        $('.card').append(statDiv3);
        $('.card').append(statDiv4);
        

        var selectedText = selector.options[selector.selectedIndex].innerHTML;
        var selectedValue = selector.value;

        function logSomeData() {

            monster = dataList[selectedValue];

            /////////////////////////////////////////////////////////
            //add some stuff to the page
            /////////////////////////////////////////////////////////
            $("#spell-name").append(`${monster.name}`);
            $("#general-stats").append(`Level: ${monster.level}<br />`);
            $("#general-stats").append(`Range: ${monster.range}<br />`);
            $("#general-stats").append(`Duration: ${monster.duration}<br />`);
            $("#general-stats").append(`Components: ${monster.components}<br />`);
            $("#general-stats").append(`Material: ${monster.material} <br />`);

            $("#more-stats").append(`School: ${monster.school[0]}<br />`);
            $("#more-stats").append(`Casting time: ${monster.casting_time}<br />`);
            $("#more-stats").append(`Concentration: ${monster.concentration} <br />`);
            $("#more-stats").append(`Ritual: ${monster.ritual}<br />`);
            $("#class-can-use").append(`Classes: ${monster.classes}<br />`);

            $("#spell-description").append(`Description: ${monster.desc[0]}<br /> ${monster.desc[1]}<br />`);
            
        }

        logSomeData();
        

    }

    var draw = function() {
        if (searchType == "spells") {
            createSpellLayout();
        } else {
            createMonsterLayout();
        }
    }();



}