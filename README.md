# DnD Quick Cards

D&D Quick Cards is a single page application to quickly search and display information listings for monsters and spells in Dungeons and Dragons 5th Edition. 

The application is intended to function as both a tool to be used by dungeon masters (DMs) while planning encounters for their groups and an in game quick reference for both DMs and players alike. It provides a clean and intuitve interface that's easy to scan for the information you need. This allows fast search results with no distractions, and minimum interuption to game flow. 

The live application can be used by going to [D&D Quick Cards](http://quickcards.ddns.net)


## UX

The application will be used by dungeon masters when planning their sessions, to look up monsters along with all the critical details that are pertinant to creating interesting and balanced encounters for their players. It also acts as a quick reference in game. For instance, when a player casts a spell that the DM isn't immidiately familiar with. A search in Quick Cards provides the essential details of the requirements of the spell as well as the full spell text. This is much faster than looking in the players hand book, which can be disruptive to the games flow.

- Scenario 1 - The DM is planning a run of the mill travelers road style encounter/side quest. The party will be ambushed on the road by Bandits who have joined forces with a local band of Goblins. The DM wants to check the stats for these monsters. They go to quickcards.ddns.net and search 'gob' and hit enter. They are informed that there were successful matches and are prompted to make a selection from the dropdown list of results. They see that there are actually two types of Goblin; Hobgoblins and regular Goblins. By easily switching between these two entries, the DM can see that the Hobgoblin is actually stronger than a regular Goblin, with a higher challenge rating and overall scores. The Hobgoblin looks like a good candidate as a sort of encounter boss, especially with his special ability that would work well with a couple of subordinates. The DM decides on two Goblins and a Hobgoblin. The DM then proceeds to search for the Bandit by typing 'ban' in the search field. They hit the search button and again are prompted to make a selection from the results. This time they get the reults Baboon, Bandit and Bandit Captain. They notice that the Bandits are even weaker than regular Goblins, but the captain is considerably stronger. The DM decides that the Captain might be overkill in this encounter, and adds 2 Bandits to their encounter. Now, they are left with the tricky task of fitting a baboon into the story, demonstrating how Quick Cards can be a tool of discovery, which can add unexpected flavour to your games.

- Scenario 2 - The crew are fighting the bad guy at the end of a story arc, the battle is difficult and one of the player pulls out a new spell they had just gotten last session. This is the first time this spell has been cast and the DM is not familiar with how it works, they ask if there is an attack roll or a save. Instead of going to the players hand book, the player goes to Quick Cards and types 'fin' and changes the selector from monsters to spells and clicks search. Six results are returned, one of which is Finger of Death. The player then reads the spell to the DM. There is no spell attack roll listed and the spell description specifies that there is indeed a constitution save that the target of the spell can make, for a chance to reduce the damage. The game can continue with the players making their rolls.

[Monster Quick Cards](http://quickcards.ddns.net)

Since the API used in this project is being hosted on an insecure server, I have out of necessity, decided to host the project on my own web server.

The server is a digital ocean droplet that I configured with a debian install along with a simple apache2 server that I had previoulsy used for my business site. Using apache virtual hosts and a free domain name from no-ip.com pointed to the server IP address, I can not only host my business site, but also host this project. 


## Features

- Feature 1 - Allows users to search the dnd5e api for either monsters or spells. Since the API capitalises each word in the monster and spell names, capitalisation of the search term, so that it matches the API, is handled in the background so the user doesn't have to worry.

- Feature 2 - Allows the user to search for partial strings, making it much faster to find what you are looking for. For instance, searching "an" in monsters and selecting "Ancient Green Dragon" from the list of results is much faster than having to type the whole monster name.

- Feature 3 - Allows the user to get a full listing of either monsters or spells by leaving the search field blank. This is fun when you are just browsing. 

- Feature 4 - Allows easy and fast switching between search categories, monsters and spells by providing the user with a drop down selector between the search field and the search button. 

- Feature 5 - Sometimes the results for a search can take a while to be displayed. So we have a loading animation, so users don't thing the site has become unresponsive. 

- Feature 6 - The user is given clear feedback if a search is successful or if it fails. This feedback is provided as a card in a similar fashion to spells and monsters. 

- Feature 7 - After selecting a monster or spell from the results, the details for the searched item are displayed in a clean card-like format. The most important details are presented at the top, and the rest is made easily accessible below. 

- Feature 8 - The user can continue making new searches. Each selection from the results list, whether a new search or a different selection from the previous search, triggers a new card to be generated.

- Feature 9 - Sometimes a monster to take an extensive range of actions. This results in a very long card, to list them all. To save space in the initial layout of the card, they are initially concealed behind a collapsable. 

- Feature 10 - There is a neat spider graph that helps to visualise a monsters ability scores. It is nicely animated as it changes shapes from one enrty to the next to reflect the changing scores.

- Feature 11 - Only relevant statistics for each monster are shown. There are many attributes that have a value of 0 or null or contain empty strings, because a monster might not have those attributes. This results in the application displaying an empty entry for abililties that monster does not posess. These have been removed.

For instance, a Giant Wasp can't speak or understand language, so there is no entry for languages. Neither has is any special resitances, saves or abilities. So none are displayed.

- Feature 12 - A simple, intuitive interface with no distractions. 




