//This is called from the searchMonsterData function 
function getData(url, cb) {
    var xhr = new XMLHttpRequest();

    //we set onredystatechange to an anon function which tests the status of the data from the API
    xhr.onreadystatechange = function () {
        //if the ready state is 4 and the status is 200
        if (this.readyState == 4 && this.status == 200) {
            //we call our callback function in the getData call and parse is as JSON data. The data held in this.responseText
            //(xhr.responseText) is passed back into the the searchMonsterData function.    
            cb(JSON.parse(this.responseText));
        } else {
            if (this.status == 404) {
                $('.card').empty();

                var errorSpan = $('<span/>', {
                    'class': 'not-found-error'
                });

                $('.card').append(errorSpan);
                $('.not-found-error').append(`The spell or monster you are searching for cound not be found`);
            }
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
    } else {
        url = 'http://www.dnd5eapi.co/api/monsters';
        searchType = 'monsters';
    }
}

function searchMonsterData() {

    
    function loadSpinner() {
    
    //create a div for the spinner
    var loadingHeader = $('<span/>', {
        'class': 'card-heading'
    });
    
    var loader = $('<div/>', {
        'class': 'loader',
    });

    $('.card').empty();
    $('.card').append(loadingHeader);
    $('.card-heading').append(`<h3>Loading results</h3>`)
    $('.card').append(loader);
    
    };

    loadSpinner();

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
            //this takes the url of the first result and puts it in the monsterURL variable
            // *** This is a problem because we actuall want the url for each returned monster ***
            monsterURL = resultArr[0].url;            
        }

        //we call getData again, this time to return the data for an individual monster
        // *** this needs to change to take multiple urls and 
        getData(monsterURL, function () {

            //create an array containing the URLS from resultArr
            function listOfURLS(mons) {
                let URL_list = [];
                for (let i = 0; i < mons.length; i += 1) {
                    URL_list.push(mons[i].url);
                }
                return URL_list;
            }          

            displayMonster(listOfURLS(resultArr));
        })
    })
}

//displayMonster() takes an array of urls to individual monsters or spell and puts them in a newArray of objects
function displayMonster(monsterURLList) {

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
            //update the global dataList variable so our array is available to other functions
            dataList = newArray;
        })
    }
}

//combinedArray is an array of objects containing monster data for each of the monsters that matched our search term.
//populateResults() adds the name and index for each monster or spell that matched the search and addes them to the select element
function populateResults(combinedArray) {

    var finishedLoading = $('<span/>', {
        'class': 'card-heading'
    });

    $('.card').empty();
    $('.card').append(finishedLoading);
    $('.card-heading').append(`<h3>Finished loading</h3><p>Choose your spell or monster from the dropdown menu</p>`);

    //https://www.electrictoolbox.com/javascript-add-options-html-select/ 

    var select = document.getElementById("selector");
    select.style.display = "block";
    //make sure the list is clear first
    removeOptions(select);

    //for each object in combinedArray create a new list item object with index.name and index as args
    for (index in combinedArray) {
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

//capitalize the fist letter
var capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

var monster;

//displaySelection() 
function displaySelection(selector) {
    //var selectedText = selector.options[selector.selectedIndex].innerHTML;
    var selectedValue = selector.value;
    monster = dataList[selectedValue];

    function createMonsterLayout() {

        //clear card first and then create the elements needed.
        $(".card").empty();

        var newSpan = $('<span/>', {
            'class': 'card-heading',
            id: 'monster-name'
        });

        var featureBlock1 = $('<div/>', {
            'class': 'feature-block col-xs-6 col-sm-6 col-md-6 col-lg-6',
            id: 'feature-block1'
        });

        var featureBlock2 = $('<div/>', {
            'class': 'feature-block col-xs-6 col-sm-6 col-md-6 col-lg-6',
            id: 'feature-block2'
        });

        var cvsAnchor = $('<div/>', {
            'class': 'cvs-anchor col-xs-12 col-sm-12 col-md-12 col-lg-12',
            id: 'cvs-anchor'
        });

        var newCanvas = $('<canvas/>', {
            'class': 'graphCanvas',
            id: 'cvs'
        }).prop({
            width: 400,
            height: 280

        });

        var statDiv3 = $('<div/>', {
            'class': 'feature-block col-xs-6 col-sm-6 col-md-6 col-lg-6',
            id: 'more-stats1'
        });

        var statDiv4 = $('<div/>', {
            'class': 'feature-block col-xs-6 col-sm-6 col-md-6 col-lg-6',
            id: 'more-stats2'
        });

        $('.card').append(newSpan);
        $('.card').append(featureBlock1);
        $('.card').append(featureBlock2);
        $('.card').append(cvsAnchor);
        $('#cvs-anchor').append(newCanvas);
        $('.card').append(statDiv3);
        $('.card').append(statDiv4);

        //if the monster has extra actions, create a collapsible.
        if (monster.actions) {            
            
            var actionCollapse = $('<button/>', {
                'class': 'collapsible inactive',
                id: 'action-collapse'
            });

            var panel1 = $('<div/>', {
                'class': 'content',
                id: 'action-content'
            });

            //append elements to .card for the collapsible
            $('.card').append(actionCollapse);

            $('.card').append(panel1);

            //create collapsible
            var coll = document.getElementsByClassName('collapsible');
            var i;



            //style the collapse button and content so they look like a single element when expanded
            /*$('.card').on('click','button',function(){

                if (actionCollapse.style.borderBottomLeftRadius != '0px') {
                    actionCollapse.style.borderBottomRightRadius = '0px';
                    actionCollapse.style.borderBottomLeftRadius = '0px';
                } else {
                    actionCollapse.style.borderBottomRightRadius = '15px';
                    actionCollapse.style.borderBottomLeftRadius = '15px';
                }
            });*/

            //expand and contract collapsible
            for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function () {
                    
                    this.classList.toggle("active");
                    this.classList.toggle("inactive");
                    this.classList.toggle("action-extension")
                    var content = this.nextElementSibling;
                    if (content.style.display === "block") {
                        content.style.display = "none";
                    } else {
                        content.style.display = "block";
                    }
                });
            }

            //append data for monster actions
            $('.collapsible').append(`<span><h5>Actions: </h5></span>`);

            //create a new array
            var actionsArr = [];
            //fill the actionsArr with the actions available to the monster
            for (let i = 0; i <= monster.actions.length - 1; i++) {
                actionsArr.push(monster.actions[i]);
            }            

            //for each action in actionsArr
            for (let j = 0; j <= actionsArr.length - 1; j++) {

                //append name, bonuses and description
                $("#action-content").append(`<p><b>${actionsArr[j].name}</b><br />`);

                //if attack_bonus exists and isn't 0, append it.
                if (actionsArr[j].attack_bonus) {
                    if (actionsArr[j].attack_bonus != 0) {
                        $("#action-content").append(`<b>Attack bonus: </b>${actionsArr[j].attack_bonus}<br />`);
                    }
                }

                //if damage_bonus exists and isn't 0, append it along with damage dice.
                if (actionsArr[j].damage_bonus) {
                    if (actionsArr[j].damage_bonus != 0) {
                        $("#action-content").append(`<b>Damage bonus: </b>${actionsArr[j].damage_bonus} <br /> 
                        <b>Damage dice: </b>${actionsArr[j].damage_dice}<br />`);
                    }
                }

                $("#action-content").append(`<b>Description: </b>${actionsArr[j].desc}</p>`);
            }
        }

        //special abilites can sometimes contain extended text, so these are also a candidate for hiding behind a collapsible element.
        //if the monster has special abilities, create a div
        if (monster.special_abilities) {
            var abilitiesDiv = $('<div/>', {
                'class': 'special-abilities',
                id: 'ability-div'
            });

            //append out new ability-div to .card
            $('.card').append(abilitiesDiv);

            //begin appending data for monster abilities
            $('#ability-div').append(`<span><h5>Special Abilities: </h5></span>`);

            //create a new array
            var abilitiesArr = [];

            //push the monsters abilities to abilitiesArr
            for (let i = 0; i <= monster.special_abilities.length - 1; i++) {
                abilitiesArr.push(monster.special_abilities[i]);
            }     

            //for each ability in abilitiesArr
            for (let j = 0; j <= abilitiesArr.length - 1; j++) {

                //if attack_bonus exits and isn't equal to 0, append it.
                if (abilitiesArr[j].attack_bonus) {
                    if (abilitiesArr[j].attack_bonus != 0) {
                        $("#ability-div").append(`<b>Attack bonus:</b> ${abilitiesArr[j].attack_bonus}<br />`);
                    }
                }

                //append ability name and description
                $("#ability-div").append(`<p><b>${abilitiesArr[j].name}</b><br /> ${abilitiesArr[j].desc}</p>`);
            }

        }

        function printMonsterCard() {

            //add more general monster stats and info to the card.           
            $("#monster-name").append(`<h2>${monster.name}</h2>`);
            $("#feature-block1").append(`<b>Alignment:</b> ${capitalize(monster.alignment)}<br />`);
            $("#feature-block1").append(`<span id="type-span"><b>Type:</b> ${capitalize(monster.type)} </span><br />`);
            if (monster.subtype != "") {
                $("#type-span").append(`(<b>Subtype: </b>${capitalize(monster.subtype)})`);
            }

            $("#feature-block1").append(`<b>Size:</b> ${capitalize(monster.size)}<br />`);
            $("#feature-block1").append(`<b>Speed: </b>${capitalize(monster.speed)}<br />`);

            $("#feature-block2").append(`<b>Challenge rating:</b> ${monster.challenge_rating}<br />`);
            $("#feature-block2").append(`<b>Hit points:</b> ${monster.hit_points}<br />`);
            $("#feature-block2").append(`<b>Armor Class:</b> ${monster.armor_class}<br />`);
            
            if (monster.stealth && monster.stealth != 0) {
                $("#feature-block2").append(`<b>Stealth:</b> ${monster.stealth}<br />`);
            }

            $("#more-stats1").append(`<b>Languages:</b> ${capitalize(monster.languages)}<br />`);
            $("#more-stats1").append(`<b>Senses: </b>${capitalize(monster.senses)}<br />`);

            if (monster.condition_immunities != "") {
                $("#more-stats2").append(`<b>Condition Immunities:</b> ${capitalize(monster.condition_immunities)} <br />`);
            }

            if (monster.damage_immunities != "") {
                $("#more-stats2").append(`<b>Damage Immunities:</b> ${capitalize(monster.damage_immunities)} <br />`);
            }

            if (monster.damage_resistances != "") {
                $("#more-stats2").append(`<b>Damage Resistances:</b> ${capitalize(monster.damage_resistances)} <br />`);
            }

            if (monster.damage_vulnerabilities != "") {
                $("#more-stats2").append(`<b>Damage Vulnerabilities:</b> ${capitalize(monster.damage_vulnerabilities)} <br />`);
            }

            if ('charisma_save' in monster) {
                $("#more-stats2").append(`<b>Charisma Save:</b> +${monster.charisma_save}<br />`);
            }
            if ('wisdom_save' in monster) {
                $("#more-stats2").append(`<b>Wisdom Save:</b> +${monster.wisdom_save}<br />`);
            }
            if ('constitution_save' in monster) {
                $("#more-stats2").append(`<b>Constitution Save:</b> +${monster.constitution_save}<br />`);
            }
            if ('dexterity_save' in monster) {
                $("#more-stats2").append(`<b>Dexterity Save:</b> +${monster.dexterity_save}<br />`);
            }
            if ('strength_save' in monster) {
                $("#more-stats2").append(`<b>Strength Save:</b> +${monster.strength_save}<br />`);
            }
            if ('intelligence_save' in monster) {
                $("#more-stats2").append(`<b>Intelligence Save:</b> +${monster.intelligence_save}<br />`);
            }
        }

        printMonsterCard();
        statSpiderGraph();
    }

    function createSpellLayout() {

        //so I don't get confused about where I am in the code and what I am working on
        let spell = monster;

        usedByClasses = [];

        for (let i = 0; i <= spell.classes.length - 1; i++) {
            usedByClasses.push(spell.classes[i].name);
        };

        descriptionList = [];

        for (let i = 0; i <= spell.desc.length - 1; i++) {
            descriptionList.push(spell.desc[i]);
        };

        //clear card first and then dynamically create the elements needed.
        $(".card").empty();

        var statBackground = $('<div/>', {
            'class': 'background',
            id: 'stat-background'
        });

        var titleSpan = $('<span/>', {
            'class': 'card-heading',
            id: 'spell-name'
        });

        var featureBlock1 = $('<div/>', {
            'class': 'feature-block col-xs-6 col-sm-6 col-md-6 col-lg-6',
            id: 'feature-block1'
        });

        var featureBlock2 = $('<div/>', {
            'class': 'feature-block col-xs-6 col-sm-6 col-md-6 col-lg-6',
            id: 'feature-block2'
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
        $('.card').append(statBackground);

        $('#stat-background').append(featureBlock1);
        $('#stat-background').append(featureBlock2);
        $('.card').append(statDiv3);
        $('.card').append(statDiv4);    

        function printSpellCard() {

            $("#spell-name").append(`<h2>${spell.name}</h2>`);

            let attrBlock1 = {"Name": spell.name, "Level": spell.level, "Duration": spell.duration, "Components": spell.duration};
            let attrBlock2 = {"School": spell.school.name, "Casting time": spell.casting_time, "Concentration": spell.concentration, "Ritual": spell.ritual};

            for (let key in attrBlock1) {
                $("#feature-block1").append(`<b>${key}: </b> ` + attrBlock1[key] + '<br />');
            } 

            if (monster.material) {
                $("#feature-block1").append(`<b>Material: </b> ${spell.material} <br />`);
            }

            for (let key in attrBlock2) {
                $("#feature-block2").append(`<b>${key}:</b> ` + attrBlock2[key] + '<br />');
            } 

            $("#class-can-use").append(`<b>Classes:</b> ${usedByClasses.join(", ")}<br />`);
            $("#spell-description").append(`<b>Description:</b> <p>${descriptionList.join(" ")}</p><br />`); 
        }

        printSpellCard();
    }

    //determine whether the user has chosen to search for monsters or spells and execute the appropriate function.
    var draw = function () {
        if (searchType == "spells") {
            createSpellLayout();
        } else {
            createMonsterLayout();
        }
    }();
}