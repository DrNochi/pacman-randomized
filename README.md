Pac-Man
=======

A historical tribute and accurate remake of the original Pac-Man arcade game

Inspired by [The Pac-Man Dossier](http://home.comcast.net/~jpittman2/pacman/pacmandossier.html)

License
-------

This program is free software: you can redistribute it and/or modify
it under the terms of the **GNU General Public License Version 3** as 
published by the Free Software Foundation.

Play
----

[Click here to play the current version](http://shaunew.github.com/Pac-Man)

You can play the game on all canvas-enabled browsers.  **Touch controls** are
enabled for mobile browsers.  The game is **resolution-independent** and smoothly scales to
fit the size of any screen.  **Performance** may increase by shrinking the window or zooming in with your browser.

### Main Controls

- **swipe**: steer pacman on mobile browsers
- **arrows**: steer pacman
- **end**: pause the game
- **escape**: open in-game menu

### Tested Browers

- Safari
- Firefox
- Chrome
- Mobile Safari (iOS web app compatible)
- Firefox Beta on Android

Games
-----

Each of the following games are playable from the main menu.

<a href="http://shaunew.github.com/Pac-Man/shots/montage2.png"><img src="http://shaunew.github.com/Pac-Man/shots/montage2.png" width="100%"/></a>

- **Pac-Man**: 1980 original arcade by Namco.
- **Ms. Pac-Man**: 1981 Pac-Man modification by GCC/Midway.
- **Crazy Otto**: GCC's unreleased, in-house version of Ms. Pac-Man before it was sold to Midway. ([See video](http://www.youtube.com/watch?v=CEKAqWk-Tp4))
- **Cookie-Man**: a brand new version of Ms. Pac-Man with a sophisticated **procedural map generator**.

### Turbo Mode

Each game has an alternate mode called Turbo (a.k.a. speedy mode).  This is a
popular hardware modification of the game found in many of the original arcade
cabinets.  In this mode, Pac-Man travels about twice as fast (same speed as the disembodied eyes of the
ghosts) and is not slowed down when eating pellets.

### High Scores

High scores for each game (normal and turbo separately) are stored on your local machine by your browser.

Learn Mode
----------

Learn Mode allows you to visualize the behaviors of the ghosts.  (The colored square represents the ghost bait.)

<a href="http://shaunew.github.com/Pac-Man/shots/learn.png"><img src="http://shaunew.github.com/Pac-Man/shots/learn.png" width="100%"/></a>

Practice Mode
-------------

This mode allows you to practice the game with special features.  You can go
into **slow-motion** or **rewind time** with the special onscreen buttons or the hotkeys listed below.  (The time-manipulation controls and design were borrowed from the game [Braid](http://braid-game.com/)).  You can also turn on **invincibility** or **ghost visualizers** from the menu.

<a href="http://shaunew.github.com/Pac-Man/shots/practice.png"><img src="http://shaunew.github.com/Pac-Man/shots/practice.png" width="100%"/></a>

### Practice Controls

- **shift**: hold down to rewind (a la Braid)
- **1**: hold down to slow down the game to 0.5x
- **2**: hold down to slow down the game to 0.25x
- **o**: toggle pacman turbo mode
- **p**: toggle pacman attract mode (autoplay)
- **i**: toggle pacman invincibility
- **n**: go to next level
- **q,w,e,r,t**: toggle target graphic for blinky, pinky, inky, clyde, and pacman, respectively.
- **a,s,d,f,g**: toggle path graphic for blinky, pinky, inky, clyde, and pacman, respectively.

Procedural Maps
---------------

In the **Cookie-Man** game mode, the mazes change as often as they do in Ms. Pac-Man, but are **procedurally generated**.  Each level has a pre-defined color palette, granting an element of consistency to the random structure of the mazes.

<a href="http://shaunew.github.com/Pac-Man/shots/procedural.png"><img src="http://shaunew.github.com/Pac-Man/shots/procedural.png" width="100%"/></a>

### Demo

[Click here to see many generated maps](http://shaunew.github.com/Pac-Man/mapgen/tetris/many.htm)

### Algorithm

The mazes are built carefully to closely match design patterns deduced from the original maps found in Pac-Man and Ms. Pac-Man:

- Map is 28x31 tiles.
- Paths are only 1 tile thick
- No sharp turns (i.e. intersections are separated by atleast 2 tiles).
- There are 1 or 2 tunnels
- No dead-ends.
- Only **I**, **L**, **T**, or **+** wall shapes are allowed, including the occasional rectangular wall.
- Any non-rectangular wall pieces must only be 2 tiles thick.

I plan to write an article explaining the algorithm in detail, but currently you can find notes, diagrams, and demos in the `mapgen` folder of this repo.

Accuracy
--------

It is a goal of this project to stay reasonably accurate to the original
arcade game. The current accuracy is due to the work of reverse-engineers Jamey Pittman and Bart Grantham.

Currently, the coordinate space, movement physics, ghost behavior, actor speeds, timers, and update rate match that of the original arcade game.

### Inaccuracies

The **timings** of certain non-critical events such as score display pauses and map-blinking animations are currently approximated.

Unfortunately, you **cannot use patterns from the original Pac-Man** because of complications with random number generators.

Also, the **collision detection** is tighter than the original (checked twice as often) to prevent pass-through "bugs".

I also chose to leave out the **overflow bug** which shifts a ghost target when Pac-Man is facing up, [detailed here](http://donhodges.com/pacman_pinky_explanation.htm).

### Report/Fix Bugs

Feel free to report any inaccuracies that may detract or simply annoy.  Any reverse-engineers willing to contribute their expertise to this project would be a big help as well!

Future Work
-----------

- Sound
- Cutscenes
- 2 Player switch-off

Navigating the Repository
-------------------------
- all javascript source files are located in the "src/" directory
- "build.sh" file concatenates all the source files into "pacman.js" in the top directory
- "debug.htm" displays the game by using the "src/*.js" files
- "index.htm" displays the game by using the "pacman.js" file only
- the "fruit" directory contains notes and diagrams on Ms. Pac-Man fruit paths
- the "mapgen" directory contains notes, diagrams, and experiments on procedural Pac-Man maze generation
- the "sprites" directory contains references sprite sheets and an atlas viewer "atlas.htm" for viewing the scalable game sprites.
- the "font" directory contains font resources used in the game.

Credits
-------

### Reverse-Engineers

Thanks to **Jamey Pittman** for compiling [The Pac-Man Dossier](http://home.comcast.net/~jpittman2/pacman/pacmandossier.html) from his own research and those of other reverse-engineers, notably 'Dav' and 'JamieVegas' from [this Atari Age forum thread](http://www.atariage.com/forums/topic/68707-pac-man-ghost-ai-question/).  Further thanks to Jamey Pittman for replying to my arcade implementation-specific questions with some very elaborate details to meet the accuracy requirements of this project.

Thanks to **Bart Grantham** for sharing his expert knowledge on Ms. Pac-Man's internals, providing me with an annotated disassembly and notes on how fruit paths work in meticulous detail.

### Original Games

Thanks to the original Pac-Man team at Namco for creating such an enduring game and not suing me.  And thanks to the MAME team for their arcade emulator and very helpful debugger.

Thanks to the Ms. Pac-Man team at GCC for improving Pac-Man with a variety of aesthetic maps that I based the map generator on.

Thanks to Jonathan Blow for creating the rewind mechanic in [Braid](http://braid-game.com) which inspired the same mechanic in my project.  Further thanks for presenting the implementation details in [this talk](https://store.cmpgame.com/product/5900/The-Implementation-of-Rewind-in-braid) which helped in my own implementation.

### Art

Thanks to Tang Yongfa and their cookie monster Pac-Man design at [threadless website](http://www.threadless.com/product/2362/Cookies) which I used as the character in the random maze mode.
