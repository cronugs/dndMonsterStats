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
};

// Trigger the search when enter is pressed (see README.md for reference)
$(document).ready(() => {
    $('#monsterName').keypress((e) => {
        if (e.keyCode == 13)
            $('#search-button').click();
    });
});

// this variable is used for the displaySelection() function to know which layout to render
let searchType;
let url = 'http://www.dnd5eapi.co/api/monsters';

/**
 * Determine if the user has selected to search monsters or spells.
 */
const categorySelect = () => {
    const select = document.getElementById("selector");
    const value = document.getElementById("category-dropdown").value;
    if (value == "spell") {
        url = 'http://www.dnd5eapi.co/api/spells';
        searchType = 'spells';
    } else {
        url = 'http://www.dnd5eapi.co/api/monsters';
        searchType = 'monsters';
    }
    removeOptions(select);
};

/**
 * @desc Called from index.html #search-button.
 */
const searchMonsterData = () => {

    const loadSpinner = (() => {

        const loadingHeader = $('<span/>', {
            'class': 'card-heading'
        });

        const loader = $('<div/>', {
            'class': 'loader',
        });

        $('.card').empty();
        $('.card').append(loadingHeader);
        $('.card-heading').append(`<h3>Loading results</h3>`);
        $('.card').append(loader);
    })();

    const search = document.getElementById("monsterName").value;

    /**
     * @desc Capitalise each word in a string.
     * @param str - The string to operate on.
     * @return String
     * @ref see README.md for reference.
     */
    const titleCase = (str) => {
        const splitStr = str.toLowerCase().split(' ');
        for (let i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' '); // Directly return the joined string
    };

    const searchTerm = titleCase(search);
    let monsterData;
    let result;
    let monsterURL;
    const reg = new RegExp(searchTerm.split('').join('\\w*').replace(/\W/, ""), 'i');

    getData(url, (data) => { //call getData with a url.

        monsterData = data.results; //monster data is an array of key value objects with the name and url for each monster

        result = monsterData.filter((element) => { //use a regular expression to match the search string to names of monsters and return matching elements
            if (element.name.match(reg)) {
                return element;
            }
        });

        if (result.length > 0) { //if we have found corresponding elements
            resultArr = result; // object with name: url key value pairs for search matches.
            monsterURL = resultArr[0].url;
        }

        getData(monsterURL, () => { //Call getData with the url to an individual result.

            /**
             * @desc create an array containing the URLS from resultArr.
             * @param mons an array of objects with name: url pairs.
             * @return an array of urls 
             */
            const listOfURLS = (mons) => {
                let URL_list = [];
                for (let i = 0; i < mons.length; i += 1) {
                    URL_list.push(mons[i].url);
                }
                return URL_list;
            };
            displayMonster(listOfURLS(resultArr));
        });
    });
};

/**
 * @desc calls getData for each url in an array. 
 * @param monsterURLList - an array of urls 
 */
const displayMonster = (monsterURLList) => {

    let newArray = [];
    let counter = 0;

    for (let i = 0; i < monsterURLList.length; i += 1) {

        getData(monsterURLList[i], (data) => { //call getData for earch url and add each returned object to a new array.

            newArray.push(data);
            counter++;
            if (counter === monsterURLList.length) {
                populateResults(newArray);
            }

            dataList = newArray; //update the global dataList variable so our array is available to other functions.
        });
    }
};

/**
 * @desc Adds the name and index for each object to a select element #selector.
 * @param combinedArray An array of spell or monster objects that matched the search term.
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

    removeOptions(select); //make sure the list is clear first.



    const defaultOption = $('<option/>', { //append a first defaut option.
        value: '',
        text: 'Select a result'
    });

    $(select).append(defaultOption);

    for (var index = 0; index <= combinedArray.length -1; index++) { //for each object in combinedArray create a new object with index.name and index as args
        select.options[select.options.length] = new Option(combinedArray[index].name, index);
    }
};

let dataList = [];

/**
 * @desc interates through a select element and remove the contents.
 * @param selectbox select element to empty
 * @ref See README.md for reference.
 */
const removeOptions = (selectbox) => {

    let i;
    for (i = selectbox.options.length - 1; i >= 0; i--) {
        selectbox.remove(i);
    }

};

/**
 * @desc Capitalise the first letter in a string.
 * @param str - string to operate on.
 * @ref See README.md for reference.
 */
const capitalize = (str) => {
    if (typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

let monster;
let recallArray = [];
let buttonNum = 0;

/**
 * @desc called from #selector in index.html. Takes the selected result and formats and displays in the page
 * @param selectedResult - The options selected by the user in #selector.
 */
const displaySelection = (selectedResult) => {

    const selectedValue = selectedResult.value;
    monster = dataList[selectedValue];

    /**
     * @desc remove the first option from a select element if its value is an empty string.
     */
    const removeDefaultOption = (() => {
        const resultSelect = document.getElementById("selector");
        const firstOption = $(resultSelect).find("option:first-child").val();

        if (firstOption == '') {
            resultSelect.remove(0);
        }
    })();

    recallArray.push(monster);

    /**
     * @desc maintain a list of the last six viewed cards and create buttons to quickly return to them.
     * @param monster the object (spell or monster) to recall.
     */
    const createRecallButtons = ((monster) => {

        $('#prev-row').empty();

        if (recallArray.length > 6) { //If there are more than six items in the array, shift the first item
            recallArray.shift();
            let remDiv = document.getElementById('prev-row');
            $(remDiv).find('button').first().remove();
        }

        for (let i = 0; i < recallArray.length; i++) { //Create a button for each item in recallArray

            const buttons = (() => {
                window["prevButton" + i] = $('<button/>', {
                    text: monster[i].name,
                    type: 'button',
                    click: () => {
                        if (monster[i].casting_time) {
                            createSpellLayout(monster[i]);
                        } else {
                            createMonsterLayout(monster[i]);
                        }
                    },
                    'class': 'prev-button col-xs-2 col-sm-2 col-md-2 col-lg-2',
                    id: `prev-button${i}`
                });
                $('#prev-row').append(window["prevButton" + i]);
            })();

        }
        buttonNum++;

    })(recallArray);

    /**
     * @desc Create and append divs to the DOM to make the card layout.
     * @param monster The object from which to generate the card.
     */
    const createMonsterLayout = (monster) => {

        if (monster != undefined) {

            $(".card").empty(); //clear card first and then create the elements needed.

            const newSpan = $('<span/>', {
                'class': 'card-heading',
                id: 'monster-name'
            });

            for (let i = 0; i <= 4; i++) { //Creates four divs for features.
                window["featureBlock" + i] = $('<div/>', {
                    'class': 'feature-block col-xs-6 col-sm-6 col-md-6 col-lg-6',
                    id: `feature-block${i}`
                });
            }

            const cvsAnchor = $('<div/>', {
                'class': 'cvs-anchor col-xs-12 col-sm-12 col-md-12 col-lg-12',
                id: 'cvs-anchor'
            });

            const newCanvas = $('<canvas/>', { //create the canvas for the spider graph.
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
            
            if (monster.actions) { //if the monster has extra actions, create a collapsible.

                const actionCollapse = $('<button/>', {
                    'class': 'collapsible inactive',
                    id: 'action-collapse'
                });

                const panel1 = $('<div/>', {
                    'class': 'content',
                    id: 'action-content'
                });

                $('.card').append(actionCollapse);

                $('.card').append(panel1);

                const coll = document.getElementsByClassName('collapsible');

                let i;
                
                for (i = 0; i < coll.length; i++) { //expand and contract collapsible
                    coll[i].addEventListener("click", function () {

                        this.classList.toggle("active");
                        this.classList.toggle("inactive");
                        this.classList.toggle("action-extension");

                        const content = this.nextElementSibling;

                        if (content.style.display === "block") {
                            content.style.display = "none";
                        } else {
                            content.style.display = "block";
                        }
                    });
                }

                $('.collapsible').append(`<span><h5>Actions: </h5></span>`);

                let actionsArr = [];
                
                for (let i = 0; i <= monster.actions.length - 1; i++) { //Fill the actionsArr with the actions available to the monster.
                    actionsArr.push(monster.actions[i]);
                }
                
                for (let j = 0; j <= actionsArr.length - 1; j++) { //for each action in actionsArr append name, bonuses and description.

                    $("#action-content").append(`<p><b>${actionsArr[j].name}</b><br />`);

                    if (actionsArr[j].attack_bonus) {
                        if (actionsArr[j].attack_bonus != 0) {
                            $("#action-content").append(`<b>Attack bonus: </b>${actionsArr[j].attack_bonus}<br />`);
                        }
                    }

                    if (actionsArr[j].damage_bonus) {
                        if (actionsArr[j].damage_bonus != 0) {
                            $("#action-content").append(`<b>Damage bonus: </b>${actionsArr[j].damage_bonus} <br /> 
                        <b>Damage dice: </b>${actionsArr[j].damage_dice}<br />`);
                        }
                    }

                    $("#action-content").append(`<b>Description: </b>${actionsArr[j].desc}</p>`);
                }
            }

            
            if (monster.special_abilities) { //if the monster has special abilities, create a div
                const abilitiesDiv = $('<div/>', {
                    'class': 'special-abilities',
                    id: 'ability-div'
                });

                $('.card').append(abilitiesDiv);
                $('#ability-div').append(`<span><h5>Special Abilities: </h5></span>`);

                let abilitiesArr = [];
                
                for (let i = 0; i <= monster.special_abilities.length - 1; i++) { //push the monsters abilities to abilitiesArr.
                    abilitiesArr.push(monster.special_abilities[i]);
                }

                for (let j = 0; j <= abilitiesArr.length - 1; j++) {

                    if (abilitiesArr[j].attack_bonus) {
                        if (abilitiesArr[j].attack_bonus != 0) {
                            $("#ability-div").append(`<b>Attack bonus:</b> ${abilitiesArr[j].attack_bonus}<br />`);
                        }
                    }

                    $("#ability-div").append(`<p><b>${abilitiesArr[j].name}</b><br /> ${abilitiesArr[j].desc}</p>`);
                }
            }

            /**
             * @desc append stats, values and text to the card layout             * 
             */
            const printMonsterCard = (() => {
           
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
            })();
            statSpiderGraph(monster);
        }
    };
    
    /**
     * @desc Creates divs for the spell card layout.
     * @param spell The object from which to generate the card.
     */
    const createSpellLayout = (spell) => {

        if (spell != undefined) {

            let usedByClasses = [];

            for (let i = 0; i <= spell.classes.length - 1; i++) {
                usedByClasses.push(spell.classes[i].name);
            }

            descriptionList = [];

            for (let i = 0; i <= spell.desc.length - 1; i++) {
                descriptionList.push(spell.desc[i]);
            }

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
             * @desc Formats and appends content to the divs in the spell card
             */
            const printSpellCard = (() => {

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
            })();
        }
    }

    /**
     * @desc Determine whether the user has chosen to search for monsters or spells and execute the appropriate function.
     */
    (() => {
        if (searchType == "spells") {
            createSpellLayout(monster);
        } else {
            createMonsterLayout(monster);
        }
    })();
}

/**
 * @desc throttle the statSpiderGraph function so it can only be called ever 200ms.
 * @param window
 */
((window) => {
    var canCall = true;
    window.statSpiderGraph = function (monster) {
        if (!canCall)
            return;

        /**
         * @desc use RGraph.js to create a spider graph.
         * @param monster object containing stats to graph. 
         */    
        const statSpiderGraph = ((monster) => {

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
        })(monster);

        canCall = false;
        setTimeout(function () {            
            canCall = true;
        }, 200);
    };
})(window);

/**
 * @desc reset the page to its original state.
 */
const reset = () => {
    location.reload();
};