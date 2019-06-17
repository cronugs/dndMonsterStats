# DnD Quick Cards

D&D Quick Cards is a single page application to quickly search and display information listings for monsters and spells in Dungeons and Dragons 5th Edition.

The application is intended to function as both a tool to be used by dungeon masters (DMs) while planning encounters for their groups and an in game quick reference for both DMs and players alike. It provides a clean and intuitive interface that's easy to scan for the information you need. This allows fast search results with no distractions, and minimum interruption to game flow.

The live application can be used by going to [D&D Quick Cards](http://quickcards.ddns.net)

## UX

The application will be used by dungeon masters when planning their sessions, to look up monsters along with all the critical details that are pertinent to creating interesting and balanced encounters for their players. It also acts as a quick reference in game. For instance, when a player casts a spell that the DM isn't immediately familiar with. A search in Quick Cards provides the essential details of the requirements of the spell as well as the full spell text. This is much faster than looking in the players hand book, which can be disruptive to the games flow.

- Scenario 1 - The DM is planning a run of the mill travelers road style encounter/side quest. The party will be ambushed on the road by Bandits who have joined forces with a local band of Goblins. The DM wants to check the stats for these monsters. They go to quickcards.ddns.net and search 'gob' and hit enter. They are informed that there were successful matches and are prompted to make a selection from the dropdown list of results. They see that there are actually two types of Goblin; Hobgoblins and regular Goblins. By easily switching between these two entries, the DM can see that the Hobgoblin is actually stronger than a regular Goblin, with a higher challenge rating and overall scores. The Hobgoblin looks like a good candidate as a sort of encounter boss, especially with his special ability that would work well with a couple of subordinates. The DM decides on two Goblins and a Hobgoblin. The DM then proceeds to search for the Bandit by typing 'ban' in the search field. They hit the search button and again are prompted to make a selection from the results. This time they get the results Baboon, Bandit and Bandit Captain. They notice that the Bandits are even weaker than regular Goblins, but the captain is considerably stronger. The DM decides that the Captain might be overkill in this encounter, and adds 2 Bandits to their encounter. Now, they are left with the tricky task of fitting a baboon into the story, demonstrating how Quick Cards can be a tool of discovery, which can add unexpected flavour to your games.

- Scenario 2 - The crew are fighting the bad guy at the end of a story arc, the battle is difficult and one of the players pulls out a new spell they had just gotten last session. This is the first time this spell has been cast and the DM is not familiar with how it works, they ask if there is an attack roll or a save. Instead of going to the players hand book, the player goes to Quick Cards and types 'fin' and changes the selector from monsters to spells and clicks search. Six results are returned, one of which is Finger of Death. The player then reads the spell to the DM. There is no spell attack roll listed and the spell description specifies that there is indeed a constitution save that the target of the spell can make, for a chance to reduce the damage. The game can continue with the players making their rolls.

### Wireframe and Mockup

Even though the finished project is somewhat different in design to the initial wireframe and mockup, the basic elements are still intact and the evolution from wireframe to finished product should be evident.

![Quick Cards Wireframe](http://quickcards.ddns.net/wireframes/QCwireframe.png)

![Quick Cards Mockup](http://quickcards.ddns.net/wireframes/QCmockup.png)

### Screenshot

![Quick Cards Desktop Screenshot](http://quickcards.ddns.net/wireframes/QCCapture.PNG)

## Features

### Existing Features

- Feature 1 - Allows users to search the dnd5e api for either monsters or spells. Since the API capitalises each word in the monster and spell names, capitalisation of the search term, so that it matches the API, is handled in the background so the user doesn't have to worry.

- Feature 2 - Allows the user to search for partial strings, making it much faster to find what you are looking for. For instance, searching "an" in monsters and selecting "Ancient Green Dragon" from the list of results is much faster than having to type the whole monster name.

- Feature 3 - Allows the user to get a full listing of either monsters or spells by leaving the search field blank. This is fun when you are just browsing.

- Feature 4 - Allows easy and fast switching between search categories, monsters and spells by providing the user with a drop down selector between the search field and the search button.

- Feature 5 - Sometimes the results for a search can take a while to be displayed. So we have a loading animation, so users don't thing the site has become unresponsive.

- Feature 6 - The user is given clear feedback if a search is successful or if it fails. This feedback is provided as a card in a similar fashion to spells and monsters.

- Feature 7 - After selecting a monster or spell from the results, the details for the searched item are displayed in a clean card-like format. The most important details are presented at the top, and the rest is made easily accessible below.

- Feature 8 - The user can continue making new searches. Each selection from the results list, whether a new search or a different selection from the previous search, triggers a new card to be generated.

- Feature 9 - Sometimes a monster to take an extensive range of actions. This results in a very long card, to list them all. To save space in the initial layout of the card, they are initially concealed behind a collapsable.

- Feature 10 - There is a neat spider graph that helps to visualise a monster's ability scores. It is nicely animated as it changes shapes from one entry to the next to reflect the changing scores.

- Feature 11 - Only relevant statistics for each monster are shown. There are many attributes that have a value of 0 or null or contain empty strings, because a monster might not have those attributes. This results in the application displaying an empty entry for abilities that monster does not possess. These have been removed. For instance, a Giant Wasp can't speak or understand language, so there is no entry for languages. Neither has it any special resistances, saves or abilities. So none are displayed.

- Feature 12 - Maintains a list of the previous 6 searches, to allow the use to quickly move between previously searched cards.

- Feature 13 - There is a reset button to allow the user to easily reset the page.

- Feature 14 - A simple, intuitive interface with no distractions.

### Features Left to Implement

There are many useful features planned for future releases. Unfortunately, with a limited time budget, I had to omit many features to be better able to focus on delivering core functionality and a polished experience. Some of the planned features include;

- Search filters to easily filter monster results by monster type, challenge rating, size etc.

- Search filters for spells to filter by magical school, level or by class.

- Built in character generator that can be used to quickly create characters that fit certain specifications like being a certain level, class and race. This would allow users to quickly create NPCs for when your players go way off track and end up in unknown territory. This can also be used to quickly roll a new character if a party member dies and you want to quickly get them back into the game as a new character.

## Technologies used

This application relies heavily on Javascript and JQuery. Since all of the actual content in the application is provided in JSON format by the dnd5e API, there was extensive work to do in JS to get the JSON data from the server and manipulate it into useful data structures to make it accessible.

Once the data has been distilled down to the single spell or monster that the user wants to view, we use JQuery calls to create our card layout and append our elements to the DOM in the correct place and the correct order.

I used bootstrap for basic responsive design, but the real heavy work is done in SCSS. There are several points that advanced SCSS techniques are used, beyond nesting and using maps. I make quite extensive use of mixins for all of the media queries and responsive design and even used some of the more advanced SCSS math functions to position the loading animation. I also used CSS clip paths to create a two toned background effect that changes as the screen size scales.

The spider graph used to visualise a monster's ability scores was created using RGraph.js. I had initially intended to use D3.js for this part of the project, but found that documentation was lacking where d3.js came to spider/radar graphs. After some searching I came across RGraph.js which made the spider graph fairly easy to implement.

## Testing

I have performed extensive testing to ensure the application operates as expected.

- Go to quickcards.ddns.net -> enter a monster name 'wolf' in all lowercase -> press enter -> 5 results containing 'wolf' are return as expected.
- enter a monster name in mixed case 'DrAgoN'-> click search -> 43 results containing the word 'dragon' are return as expected.
- enter a string of random letters 'hasdfadf' -> returns a spell or monster not found error as expected.
- enter a partial string 'ha' and leave monsters selected in the dropdown -> 19 matching monsters are returned.
- select 'Blood Hawk' from results dropdown -> The correct card is displayed.
- leave the search term in place and make a new selection 'Rakshasa' from the dropdown -> The correct card is displayed and the graph changes with an animation.
- leave the search string in place, but change the selector to spells -> click search -> 17 spells are returned.
- Select 'Charm Person' from the dropdown -> The correct spell card is returned and replaces the previous monster card.
- Leave the search term in place and make a new selection 'Thaumaturgy' from the results dropdown -> The spell card for 'Thaumaturgy' replaces the previous card.
- With a spell already being displayed, enter a new search term 'spi' and change the selector to Monsters -> click search -> 9 monsters are returned.
- Select 'Gynosphinx' from the dropdown -> The correct card is displayed -> Click on the Actions collapsable -> It opens to reveal the monster's actions.
- Click on Actions again -> the collapsable closes as expected.
- The bottom left and right border radius on the Action collapsible toggle when it is opened and closed as expected.

The layout has been tested for responsive design across all the platforms and screen sizes I have immidiate access to, including; 

- Mobile Chrome on Android and iOS
- Mobile Safari on iOS
- Mobile Samsung Internet on Android
- Desktop Chrome on Windows and Linux
- Desktop Firefox on Windows and Linux

I also had the application tested by two Dungeon Masters and three players. Bugs or unexpected behaviours that were reported were fixed.

## Deployment

Since the API used in this project is being hosted on an insecure server, a live version cannot be hosted from GitHub Pages. The live project is therefore hosted on another webserver that has been set up for the task.

The server is a digital ocean droplet that has been configured with debian and the Apache2 web server. The site is updated once (somtimes more) a day from the repository via ssh.

If you are interested in contributing to this project you can do so by following these steps;

This project uses SASS/SCSS so you will need to make sure that is installed. 

If you run windows you can follow instructions to install SASS [here](https://www.impressivewebs.com/sass-on-windows/). Alternatively, you can install Windows Subsystem for Linux (WSL) and follow the rest of the instructions for Linux. Instructions to install WSL can be found [here](https://itsfoss.com/install-bash-on-windows/)

If you are on Mac check out [compass.app](http://compass.kkbox.com/)

If you run Linux you can use your package manager to search and install SASS and it's dependancies.

on Debian or Ubuntu:

```
user@somecoolhostname:~$ sudo apt-get install ruby-sass
````
on Arch:

```
user@somecoolhostname:~$ sudo pacman -S ruby-sass
```

Now that you are up and running with SASS/SCSS we can clone the repo and get to work
1. change to the directory where you keep your projects

```
user@somecoolhostname:~$ cd ~/code/
```

2. Make a local copy of the repository by cloning it with git

```
user@somecoolhostname:~$ git clone https://github.com/cronugs/dndMonsterStats
```

3. Set SASS to watch the file static/css/style.scss this way updates to style.scss will be written to style.css every time it is saved

```
user@somecoolhostname:~$ sass --watch style.scss:style.css

```

4. Open your editor and point it to the project directory. I recommend a live preview so that the page is reloaded in the browser every time you save. VS code has a plugin available to do this called Live Server, which I highly recommend.

## Bugs

There are currently two issues that remain, both of which are in the API. As previously mentioned, the API is hosted on an insecure server. While this isn't a problem at the moment since there is no sensitive data being transferred, it does create some issues with hosting the project on some services like GitHub.

The second issue is that some of the text in spell descriptions contain unexpected characters. For instance, the description of the spell 'Spirit Guardians' reads; "An affected creatureâ€™s speed is halved in the area". After researching this issue it seems that this has happened because the text has been badly encoded from UTF-8 to a microsoft encoding, and back to UTF-8 again, bringing those characters along the way. I have contacted the author of the dnd5eapi on slack about both of these issues and have not received any response. The slack channel is very quiet and since I intend to continue work on this project in the future, I will continue in my attempts to get in touch, and may even get involved with development of the API.

## Credits

### Content

All the content displayed in monster and spell cards comes directly from the dnd5e API. Thank you so much for your hard work, without which this project would not have been possible.

### Acknowledgements

I'd like to thank Gary Simon for his excellent SASS crash course which helped my get a better understanding of mixins. I also borrowed his idea of using clip paths to create a two toned background. [SASS Crash Course](https://www.youtube.com/watch?v=roywYSEPSvc).

I'd especially like to thank Kyle Simpson whose books 'Scope & Closures' and 'this & Object Prototypes' were hugely helpful in expanding my understanding of JavaScript. His books are free to read on GitHub and I highly recommend them [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS).

There are some snippets of code that I found while searching for answers to problems I was solving.

Thanks to user somethinghere on stackoverflow for a function that capitalises the first letter in every word in a string [found here](https://stackoverflow.com/questions/32589197/capitalize-first-letter-of-each-word-in-a-string-javascript/32589256).

Thanks to user Fabiano on stackoverflow for this snippet to remove entries in a selector [found here](https://stackoverflow.com/questions/3364493/how-do-i-clear-all-options-in-a-dropdown-box/3364546#3364546).

Thanks to Flavio Copes for a snippet to caps the first letter in a string [found here](https://flaviocopes.com/how-to-uppercase-first-letter-javascript/).

Thanks to w3schools for the loading animation [found here](https://www.w3schools.com/howto/howto_css_loader.asp).

