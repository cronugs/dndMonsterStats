//This is called from the searchMonsterData function 
const getData = (url, cb) => {
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

                const errorSpan = $('<span/>', {
                    'class': 'not-found-error'
                });

                $('.card').append(errorSpan);
                $('.not-found-error').append(`The spell or monster you are searching for could not be found`);
            }
        }
    };

    xhr.open("GET", url);
    xhr.send();
}

// Trigger the search when enter is pressed (see README.md for reference)
$(document).ready(() => {
    $('#monsterName').keypress((e) => {
        if (e.keyCode == 13)
            $('#search-button').click();
    });
});

// this variable is used for the displaySelection() function to know which layout to render
let searchType;
url = 'http://www.dnd5eapi.co/api/monsters';

//set the searchType variable and set the url to point to monsters or spells with the select box
const categorySelect = () => {
    const select = document.getElementById("selector");
    const category = document.getElementById("category-dropdown").value;
    if (category == "spell") {
        url = 'http://www.dnd5eapi.co/api/spells';
        searchType = 'spells';
    } else {
        url = 'http://www.dnd5eapi.co/api/monsters';
        searchType = 'monsters';
    }
    removeOptions(select);
}

const searchMonsterData = () => {

    const loadSpinner = () => {

        //create a div for the spinner
        const loadingHeader = $('<span/>', {
            'class': 'card-heading'
        });

        const loader = $('<div/>', {
            'class': 'loader',
        });

        $('.card').empty();
        $('.card').append(loadingHeader);
        $('.card-heading').append(`<h3>Loading results</h3>`)
        $('.card').append(loader);
    };

    loadSpinner();

    const search = document.getElementById("monsterName").value;

    //Capitalise each word in the seach term, so that it matches the data (see README.md for reference)
    const titleCase = (str) => {
        const splitStr = str.toLowerCase().split(' ');
        for (let i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        // Directly return the joined string
        return splitStr.join(' ');
    }

    const searchTerm = titleCase(search);
    let monsterData;
    let result;
    let monsterURL;
    const reg = new RegExp(searchTerm.split('').join('\\w*').replace(/\W/, ""), 'i');

    //call the get data function and give it the url 
    getData(url, (data) => {

        //monster data is an array of key value objects with the name and url for each monster
        monsterData = data.results;

        //here we use our regex to match the search string to names of monsters and return matching elements
        result = monsterData.filter((element) => {
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
        getData(monsterURL, () => {

            //create an array containing the URLS from resultArr
            const listOfURLS = (mons) => {
                let URL_list = [];
                for (let i = 0; i < mons.length; i += 1) {
                    URL_list.push(mons[i].url);
                }
                return URL_list;
            }
            console.log(listOfURLS(resultArr));
            displayMonster(listOfURLS(resultArr));
        })
    })
}

//displayMonster() takes an array of urls to individual monsters or spell and puts them in a newArray of objects
const displayMonster = (monsterURLList) => {
    console.log(monsterURLList);

    let newArray = [];
    let counter = 0;
    //for each url in monsterURLList

    for (let i = 0; i < monsterURLList.length; i += 1) {
        //call getData for url and get data back
        getData(monsterURLList[i], (data) => {

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

/**
 * populateResults adds the name and index for each monster or spell that matched the search and adds them to the select element
 * The argument combinedArray is an array of objects containing monster data for each of the monsters that matched the search term.
 */
const populateResults = (combinedArray) => {

    const finishedLoading = $('<span/>', {
        'class': 'card-heading'
    });

    $('.card').empty();
    $('.card').append(finishedLoading);
    $('.card-heading').append(`<h3>Success!</h3><p>Choose your spell or monster from the dropdown menu</p>`);

    const select = document.getElementById("selector");
    const resetButton = document.getElementById("reset-button");
    select.style.display = "block";
    resetButton.style.display = "block";
    //make sure the list is clear first
    removeOptions(select);

    //for each object in combinedArray create a new list item object with index.name and index as args
    for (index in combinedArray) {
        select.options[select.options.length] = new Option(combinedArray[index].name, index);
    }
}

let dataList = [];

/**
 * removeOptions interates through the dropdown HTML element and remove the contents of the select element 
 * specified as an argument. (See README.md for reference) 
 */
const removeOptions = (selectbox) => {

    let i;
    for (i = selectbox.options.length - 1; i >= 0; i--) {
        selectbox.remove(i);
    }
}

//capitalize the fist letter (see README.md for reference)
const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

let monster;
let recallArray = [];
let buttonNum = 0;

const reCounter = () => {
    recallCounter = 0;
    recallCounter++;
    return recallCounter;
}

/**
 * 
 * @param {*} selectedResult 
 */
const displaySelection = (selectedResult) => {

    const selectedValue = selectedResult.value;
    monster = dataList[selectedValue];

    recallArray.push(monster);
    // invokedItems.unshift(monster.url);
    console.log(recallArray);
    const createRecallButtons = () => {      

        $('#prev-row').empty();

        for (let i = 0; i < recallArray.length; i++) {
            if (recallArray.length > 6) {
                recallArray.shift();
                let remDiv = document.getElementById('prev-row');
                $(remDiv).find('button').first().remove();
            }

            const buttons = (() => {
                window["prevButton" + i] = $('<button/>', {
                    text: recallArray[i].name,
                    type: 'button',
                    click: () => {
                        //console.log(monster);
                        //console.log(reCounter());
                        console.log(recallArray);
                        //this.monster = monster;
                        if (recallArray[i].casting_time){
                            createSpellLayout(recallArray[i]);
                        } else {
                            createMonsterLayout(recallArray[i]);
                        }
                    },
                    'class': 'prev-button col-xs-2 col-sm-2 col-md-2 col-lg-2',
                    id: `prev-button${i}`
                });
                $('#prev-row').append(window["prevButton" + i]);
            })()
            
        }
        buttonNum++;
        

       

        /* console.log(invokedItems);      
    
        window["prevButton" + divCounter] = $('<button/>', {
            text: monster.name,
            type: 'button',
            click: () => {
                
                console.log(monster);
                console.log(reCounter());
                console.log(counter);
                //this.monster = monster;
                createMonsterLayout(recallArray[counter]);
            },
            'class': 'prev-button col-xs-2 col-sm-2 col-md-2 col-lg-2',
            id: `prev-button${divCounter}`
        });
    
        $('#prev-row').append(window["prevButton" + divCounter]);
        
        divCounter++;
        reCounter();
    
        if (divCounter > 6) {
            invokedItems.pop();
            let remDiv = document.getElementById('prev-row');
            $(remDiv).find('button').first().remove();
        }      */
    }

    createRecallButtons();

    const createMonsterLayout = (monster) => {

        if (monster != undefined) {

            //clear card first and then create the elements needed.
            $(".card").empty();

            const newSpan = $('<span/>', {
                'class': 'card-heading',
                id: 'monster-name'
            });

            //replaced four individual code blocks with this for loop
            for (let i = 0; i <= 4; i++) {
                window["featureBlock" + i] = $('<div/>', {
                    'class': 'feature-block col-xs-6 col-sm-6 col-md-6 col-lg-6',
                    id: `feature-block${i}`
                });
            }

            const cvsAnchor = $('<div/>', {
                'class': 'cvs-anchor col-xs-12 col-sm-12 col-md-12 col-lg-12',
                id: 'cvs-anchor'
            });

            const newCanvas = $('<canvas/>', {
                'class': 'graphCanvas',
                id: 'cvs'
            }).prop({
                width: 450,
                height: 280
            });

            $('.card').append(newSpan);
            $('.card').append(featureBlock1);
            $('.card').append(featureBlock2);
            $('.card').append(cvsAnchor);
            $('#cvs-anchor').append(newCanvas);
            $('.card').append(featureBlock3);
            $('.card').append(featureBlock4);

            //if the monster has extra actions, create a collapsible.
            if (monster.actions) {

                const actionCollapse = $('<button/>', {
                    'class': 'collapsible inactive',
                    id: 'action-collapse'
                });

                const panel1 = $('<div/>', {
                    'class': 'content',
                    id: 'action-content'
                });

                //append elements to .card for the collapsible
                $('.card').append(actionCollapse);

                $('.card').append(panel1);

                //create collapsible
                const coll = document.getElementsByClassName('collapsible');
                let i;

                //expand and contract collapsible
                for (i = 0; i < coll.length; i++) {
                    coll[i].addEventListener("click", function () {

                        this.classList.toggle("active");
                        this.classList.toggle("inactive");
                        this.classList.toggle("action-extension")
                        const content = this.nextElementSibling;
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
                let actionsArr = [];
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
                const abilitiesDiv = $('<div/>', {
                    'class': 'special-abilities',
                    id: 'ability-div'
                });

                //append out new ability-div to .card
                $('.card').append(abilitiesDiv);

                //begin appending data for monster abilities
                $('#ability-div').append(`<span><h5>Special Abilities: </h5></span>`);

                //create a new array
                let abilitiesArr = [];

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

            const printMonsterCard = () => {

                //Add monster name as card title.           
                $("#monster-name").append(`<h2>${monster.name}</h2>`);

                const blkOne = {
                    "Alignment": monster.alignment,
                    "Type": monster.type,
                    "Subtype": monster.subtype,
                    "Size": monster.size,
                    "Speed": monster.speed
                };

                const blkTwo = {
                    "Challenge rating": monster.challenge_rating,
                    "Hit Points": monster.hit_points,
                    "Armor Class": monster.armor_class,
                    "Stealth": monster.stealth
                };

                const ftrResImm = {
                    "Condition immunities": monster.condition_immunities,
                    "Damage immunities": monster.damage_immunities,
                    "Damage resistances": monster.damage_resistances,
                    "Damage vulnerabilities": monster.damage_vulnerabilities
                };

                const saves = {
                    "charisma_save": monster.charisma_save,
                    "wisdom_save": monster.wisdom_save,
                    "constitution_save": monster.constitution_save,
                    "dexterity_save": monster.dexterity_save,
                    "strength_save": monster.strength_save,
                    "intelligence_save": monster.intelligence_save
                };

                for (let key in blkOne) {
                    if (key != "Type" && key != "Subtype" && blkOne[key] != "") {
                        $("#feature-block1").append(`<b>${key}: </b>${capitalize(blkOne[key])}<br />`);
                    } else {
                        if (key == "Type") {
                            $("#feature-block1").append(`<span id="type-span"><b>${key}: </b>${capitalize(blkOne[key])} </span><br />`);
                        } else {
                            if (monster.subtype != "") {
                                $("#type-span").append(`(<b>${key}: </b>${capitalize(blkOne[key])})`);
                            }
                        }
                    }
                }

                for (let key in blkTwo) {
                    if (blkTwo[key] && blkTwo[key] != 0) {
                        $("#feature-block2").append(`<b>${key}: </b>${blkTwo[key]}<br />`);
                    }
                }

                if (monster.languages && monster.languages != "") {
                    $("#feature-block3").append(`<b>Languages: </b>${capitalize(monster.languages)}<br />`);
                }

                $("#feature-block3").append(`<b>Senses: </b>${capitalize(monster.senses)}<br />`);

                for (let key in ftrResImm) {
                    if (ftrResImm[key] != "") {
                        $("#feature-block4").append(`<b>${key}: </b> ` + capitalize(ftrResImm[key]) + '<br />');
                    }
                }

                for (let key in saves) {
                    keyString = capitalize(key.split("_").join(" "));
                    if (key in monster) {
                        $("#feature-block4").append(`<b>${keyString}: </b>` + saves[key] + '<br />');
                    }
                }
            }

            printMonsterCard();
            statSpiderGraph(monster);
        }
    }
    /**
     * createSpellLayout creates divs for the spell card layout.
     */

    const createSpellLayout = (monster) => {

        const spell = monster;

        if (spell != undefined) {

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

            const statBackground = $('<div/>', {
                'class': 'background',
                id: 'stat-background'
            });

            const titleSpan = $('<span/>', {
                'class': 'card-heading',
                id: 'spell-name'
            });

            //replaced two individual code blocks with this for loop
            //create two divs
            for (let i = 0; i <= 2; i++) {
                window["featureBlock" + i] = $('<div/>', {
                    'class': 'feature-block col-xs-6 col-sm-6 col-md-6 col-lg-6',
                    id: `feature-block${i}`
                });
            }

            const statDiv3 = $('<div/>', {
                'class': 'feature-block',
                id: 'class-can-use'
            });

            const statDiv4 = $('<div/>', {
                'class': 'description-block',
                id: 'spell-description'
            });

            $('.card').append(titleSpan);
            $('.card').append(statBackground);

            $('#stat-background').append(featureBlock1);
            $('#stat-background').append(featureBlock2);
            $('.card').append(statDiv3);
            $('.card').append(statDiv4);

            /**
             * printSpellCard formats and appends content to the divs in the spell card
             */
            const printSpellCard = () => {

                $("#spell-name").append(`<h2>${spell.name}</h2>`);

                const attrBlock1 = {
                    "Name": spell.name,
                    "Level": spell.level,
                    "Duration": spell.duration,
                    "Components": spell.components
                };
                const attrBlock2 = {
                    "School": spell.school.name,
                    "Casting time": spell.casting_time,
                    "Concentration": spell.concentration,
                    "Ritual": spell.ritual
                };

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
    }

    /**
     * Determine whether the user has chosen to search for monsters or spells and execute the appropriate function.
     */
    (() => {
        if (searchType == "spells") {
            createSpellLayout(monster);
        } else {
            createMonsterLayout(monster);
        }
    })()
}

/**
 * statSpiderGraph uses RGraph.js to draw the spider graph
 */
const statSpiderGraph = (monster) => {

    var str = monster.strength;
    var dex = monster.dexterity;
    var con = monster.constitution;
    var int = monster.intelligence;
    var wis = monster.wisdom;
    var cha = monster.charisma;

    spidy = new RGraph.Radar({
        id: 'cvs',
        data: [str, dex, con, int, wis, cha],
        options: {
            tooltips: [
                'Strength ' + str, 'Dexterity ' + dex,
                'Constitution ' + con, 'Intelligence ' + int,
                'Wisdom ' + wis, 'Charisma ' + cha
            ],
            backgroundCirclesPoly: true,
            backgroundCirclesSpacing: 30,
            colors: ['transparent'],
            axesColor: 'transparent',
            highlights: true,
            colorsStroke: ['yellow'],
            linewidth: 2,
            labels: ['Strength ' + str, 'Dexterity ' + dex, 'Constitution ' + con,
                'Intelligence ' + int, 'Wisdom ' + wis, 'Charisma ' + cha
            ],
            //labelsAxes: 'e',
            labelsAxesColor: 'black',
            textSize: 12,
            textColor: 'white',
            //clearto: 'white',
            labelsAxesBoxed: false,
            labelsAxesBoxedZero: true,
            textAccessible: false,
            textAccessibleOverflow: 'visible'

        }
    }).grow();
}

/**
 * reset back to our starting point
 */
const reset = () => {
    location.reload();
}

let invokedItems = [];
divCounter = 0;



//const retrievePrev = () => {

//displaySelection().createMonsterLayout(monster);

//let prevList

/*let newArray = [];
for (let i = 0; i < invokedItems.length; i += 1) {
    getData(invokedItems[i], (data) => {
        newArray.push(data);
        
        //update the global dataList variable so our array is available to other functions
        prevList = newArray;
    })
}*/
//}