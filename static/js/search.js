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
    var search = document.getElementById("monsterName").value;

    //Caoitalise each work in the seach term
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

    //call the get data function and give it the url 
    getData(url, function (data) {

        monsterData = data.results;
        console.log(monsterData);

        result = monsterData.filter(function (element) {
            return element.name == searchTerm;
        });

        if (result.length > 0) {
            //we have found a corresponding element
            monsterURL = result[0].url;
        }

        getData(monsterURL, function (data) {

            searchedMonster = data;
            displayMonster(searchedMonster);
        })

    })
}

function displayMonster(searchedMonster) {
    data = searchedMonster;
    console.log(searchedMonster);
    challenge_rating = searchedMonster.challenge_rating;

    var wrapper = $("#challenge-rating"),
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
}

//This snippet was found here https://stackoverflow.com/questions/46143452/get-value-from-dictionary-in-javascript-by-key

//getData(monsterURL, function (data) {
//console.log(monsterURL);
//  console.log(data);
//  searchedMonster = data;
//console.log(searchedMonster);
// })