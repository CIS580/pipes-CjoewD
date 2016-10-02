# Pipes
An simple plumbing game template in HTML5,
created for the Fall 2016 class of CIS 580 at Kansas State University.

## Requirements
For this assignment, you will be creating a clone of [Pipe Mania](https://en.wikipedia.org/wiki/Pipe_Mania), which will need to meet the following requirements:

1. The game world is divided into a regular grid, in which tiles representing pipes can be placed (10 points).
2. At the start of each level, an un-editable starting pipe and ending pipe appear.  If the player manages to connect these with pipes, the level is completed.  The start and end connection of the pipes should be available (10 points).
3. At the start of the level, 'fluid' begins to flow from the start pipe.  If the fluid manages to reach the end of assembled pipes, the game is lost (10 points).
4. The game score and level are represented on-screen (10 points).
5. The kind of pipe available appear in random order, and the player can place them by left-clicking on the board (10 points).
6. Right-clicking on a pipe that does not yet have fluid in it rotates the pipe tile.  Pipes with fluid in them cannot be rotated (10 points).
7. The speed at which fluid fills pipes increases as the player advances in level (10 points).
8. Placing pipes, rotating pipes, finishing a level, and loosing the game should all have sound effects that play when these events happen (10 points).
9. The game should play background music (10 points).
10. Instructions for playing the game should appear in-game or on the page (10 points).

### Extra Credit
1. Add at least 3 additional kinds of pipes with special attributes (i.e. a reservoir that fills up more slowly) (10 points).
2. An additional 10 point bonus is available for exceptional designs (10 points).

## Bundling
The source code in the src directory is bundled into a single file using **Browserify**.  The Browserify tools must first be installed on your system:

```$ npm install -g browserify``` (for OSX and linus users, you may need to preface this command with ```sudo```)

Once installed, you can bundle the current source with the command:

```$ browserify src/app.js -o bundle.js```

Remember, the browser must be refreshed to receive the changed javascript file.

## Watching

You may prefer to instead _watch_ the files for changes using **Watchify**.  This works very similarily to Browserify.  It first must be installed:

```$ npm install -g watchify``` (again, ```sudo``` may need to be used on linux and OSX platforms)

Then run the command:

```watchify src/app.js -o bundle.js```

The bundle will automatically be re-created every time you change a source file.  However, you still need to refresh your browser for the changed bundle to take effect.

## Credits
Pipe tiles by surt, and released into the public domain on [OpenGameArt.com](http://opengameart.org/content/plums)

Game framework HTML5/CSS3/Javascirpt code was written by course instructor [Nathan Bean](http://nathanhbean.com), and also released under the [CC-A-SA 3.0 License](https://creativecommons.org/licenses/by-sa/3.0/)

Background music loop credit goes to LittleRobotSoundFactory
https://freesound.org/people/LittleRobotSoundFactory/sounds/321005/
terms: https://creativecommons.org/licenses/by/3.0/

success sound credit goes to LittleRobotSoundFactory
https://freesound.org/people/LittleRobotSoundFactory/sounds/270404/
terms: https://creativecommons.org/licenses/by/3.0/