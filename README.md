


# Subscriber Wars
<a href="https://www.buymeacoffee.com/edgars.garsneks" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="20.5" width="87"></a> 

Subscriber Wars is a simple web game that simulates the competition between small bots that are based on the my YouTube channel subscribers. It was created as a small celebration for reaching 100 subscriber milestone.

<img src="./imgs/game.gif" alt="Subscriber Wars Game" width="100%" loop="infinite">


While it is not much, but I would like to have this as a first step in creating something were you my dear friends can contribute and take part of! 

## The Game

Game is built using ECS architecture, which allows to easily add new features and components. It is written in JavaScript and uses canvas for rendering.

Each bot is a circle that moves around the world, and shoots bullets at other bots. When smaller bot is killed by larger one, killer increases it's size by 1. But if larger bot is killed by smaller one, it takes the size of the larger bot. 

There are two kinds of bots - public and annonymous subscribers. Subsribers that are public are represented by circle with their thumbnail images, which are gathere by YouTube's API. Anonymous subscribers are represented by circles with random colors and no images. Only public subscribers are able to fight for the win, while anonymous ones are just there to make the game more interesting.

Time to time powerup will spawn, granting some advantage to the bot which collects it. 

Game continues until first bot reaches size of 100.

## The Goal

Goal of this project is to create a place where community can work together to create something more fun and engaging. I encourage you to join and implement some fun, creative ideas. If they are reasonable and fit the game, I will gladly merge them into the main branch!

## FAQ

1. I'm subscribed to your channel, but I don't see my bot in the game!
   - Initial pool of subscribers was taken on `2025-07-20` via YouTube's API, which returns only profiles with public setting. If you want to join the fun either - set to public and you will be imported next time or create a PR by adding yourself into `subscribers.json` file.

2. How can I contribute?
    - Feel free to implement new features, fix bugs or provide any improvements. You can start by forking the repository, making changes and creating a pull request. I will review it and merge if it fits the game.

3. I would like to have custom behaviour for my bot!
    - You can create a custom bot by adding your own logic in `js/game/bot-ai/` directory and configure it in `subsribers.js`. Just make sure to follow the existing structure and conventions. You can also create a pull request with your bot and I will gladly merge it into the main branch. As long as it is reasonable and fits the game.

4. I don't want to be part of this game anymore!
    - You can either remove yourself from the game by removing your entry from `subscribers.json` file or creating issues to request removal. I will remove your bot from the game and you will not be able to join again.

