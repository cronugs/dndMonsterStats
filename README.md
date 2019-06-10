# DnD Quick Cards

D&D Quick Cards is a single page application to quickly search and display information listings for monsters and spells in Dungeons and Dragons 5th Edition. 

The application is intended to function as an in game quick reference for both dungeon masters and players alike. It provides a clean and intuitve interface to allow fast search results with no distractions. 

## UX

The application will be used by dungeon masters when planning thier session, to look up monsters along with all the critical details that are pertinant to creating interesting and balanced encounters for their players. It also acts as a quick reference in game, when a player casts a spell that you aren't familiar with. A search in quick cards provides the full text for the spell and is much faster than looking in the players hand book, which can be disruptive to the games flow.

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




