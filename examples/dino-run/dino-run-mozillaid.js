"use strict";

let game = new MicroCanvas();

// Graphics assets
let gfxClouduboy, gfxLogo, gfxClouds, gfxCactus;

let gfxDino;

// Frames 0-3: run animation, Frame 4: Eeek, Frame 5: Kaput, Frame 6: Wave
const DINO_EEK_FRAME = 4;
const DINO_KAPUT_FRAME = 5;
const DINO_HELLO_FRAME = 6;

//
const DINO_SHADOW_START = 6;
const DINO_SHADOW_SIZE = 32-2*6;

// Sound assets
let sfxBling, sfxPlop, sfxBoing, sfxEek, sfxBust;

// Game state globals
const S_INTRO = 1;
const S_PLAYING = 2;
const S_GAMEOVER = 3;

// Other globals and constants
const START_SPEED = 75;

let baseline, baselineDino;



// Setup phase
// Load assets, preconfigure globals, set up microcanvas subsystem
game.setup(function(game) {
  gfxClouduboy = game.loadGraphics(`
    ! clouduboy 96x17
    .....#####.....##..............................##..............##.............................
    ...##.....#...#..#............................#..#............#..#............................
    ..#...##...#..#..#............................#..#............#..#............................
    ..#..#..#...#.#..#...#####....##....##....#####..#..##....##..#..#####.....#####....##....##..
    .#..#....#..#.#..#..#.....#..#..#..#..#..#....#..#.#..#..#..#.#..#....#...#.....#..#..#..#..#.
    .#..#.....##..#..#.#...#...#.#..#..#..#.#........#.#..#..#..#.#....#...#.#...#...#.#..#..#..#.
    .#..#.........#..#.#..#.#...##..#..#..#.#...###..#.#..#..#..#.#...#.#..#.#..#.#...##..#.#...#..
    .#..#.....###.#..##..#...#..##..#..#..#.#..#..#..#.#..#..#..#.#..#..#..##..#...#..#.#..##..#..
    .#..#....#..#.#..##..#...#..##..#..#..#.#..#..#..#.#..#..#..#.#..#..#..##..#...#..#.#..#...#...
    .#...#...#..#.#..##..#...#..##..#..#..#.#..#..#..#.#..#..#..#.#..#..#..##..#...#..#.#..#..#...
    ..#...###...#.#..#.#..#.#...##...###..#.#...###..#.#...###..#.#...##...#.#..#.#..#..#.....#....
    ..#........#..#..#.#...#...#.#........#.#........#.#........#.#........#.#...#...#..#....#....
    ...##....##...#..#..#.....#...#....#..#..#....#..#..#....#..#.#..#....#...#.....#...#....#.....
    .....####......##....#####.....####.###...####.###...####.###..##.####.....#####..##....#.....
    .................................................................................#.....#.....
    ..................................................................................#####......
    ............................................................................................
`
  );

  gfxLogo = game.loadGraphics(
    `! 64x64 mozspacejkt
................................................................
................................................................
................................................................
.......................##################.......................
....................####................####....................
..................###.....#...#.....#......###..................
................###....#..#...#....##..#.....###................
...............##....#..#.##.###..##..#.#......##...............
.............###...##.#.##.###.#...#.##.#.##....###.............
............##....#.#..##.............##..####....##............
...........##...##..##.....##.#..######..####..#...##...........
..........##...##.#.#...###...##.......##..#..##.#..##..........
.........##..##.#.#...##.....###.....##..##..#####...##.........
........##...###.#..##.......####...####...#..###.#...##........
.......##...####..##........#####..#####....##...##....#........
.......#....###..#..........#####.#######.....#..#.#...##.......
......##.....#..#............###........##.....#.##..#..##......
......#...#....#...........##...##.##.....##....#...##...#......
.....##.####...#............#####........####...#..###...##.....
.....#...###..#...........##.###.####............#..#..#..#.....
....##...##..#...........###.###.#####....###.....#..##...##....
....#.......#...........####.###.######..######....#.#..#..#....
...##.......#............###.###.#..###.########...#..###..##...
...#..###..#..............##.###.#..###.###..###...#..#.....#...
...#..####.#...............#.###.#####..###..###....#...##..#...
...#..###..#............###..###.#####..########....#..###..#...
..##.......#...........####..###.####...............#.......##..
..#.......#.............###..###...............#.....#.......#..
..#...#...#..............##..###................#....#.......#..
..#..###..#..............#...###................#....#.#.##..#..
..#..###..#............###.#.###................#....#.#####.#..
..#..###..#...........###....###................#....#..#..#.#..
..#.......#............##.#..###.....##.......##.....#.......#..
..#.......#.............#....###......#....##........#..###..#..
..#.......#..........###.....###............#........#....##.#..
..#.......#...........##....#.##.....................#..##...#..
..#.......#....##......#....##.....###.......#.......#...#...#..
..#.......#...#.##..###......######...#.......#.....#...###..#..
..##.......#..#.##..###........##......#......#.....#..#.#..##..
...#.......#..#..######.................#.....#.....#..#....#...
...#.......#..#...##..#.................#......#...#..####..#...
...#.......#..#.......##...#...........#.......#...#.....#..#...
...##.......#.#........##....#......###............#.##....##...
....#.......#..#...####..###.......###.....#...#.##..###...#....
....##.......#..#..######....#######.....#....#####....##.##....
.....#.......#..#....##############........#.#.#.#........#.....
.....##.......#..#.....############..........#...#.......##.....
......#........##.#.....###########.........#...#........#......
......##.........###################......####.#........##......
.......##.......#.......................##....#........##.......
.......##.......#...#..#..#.#..#...#.###.#....#........#........
........#.......#...#.#.#.#.#.#.#.#.#.#.#.#...#.......##........
........#.#####.#...#.#.#.##..#.#.#.#.#.#.#...#.#####.#.........
..........#.....#...#.###.#.#.###.##..#.###...#.....#...........
..........#.....#...#.#.#.#.#.#.#.#.#.#.#.#...#.....#...........
...........#....#..#..........................#....#............
...........#....#.........##.#.##.##.#........#....#............
...........#....#.............................#....#............
...........#....#######.################.######....#............
..........#............#................#...........#...........
..........#............#.##..........##.#...........#...........
..........#############....##########....############...........
................................................................
................................................................
`
  );

  gfxDino = game.loadGraphics(`
    ! id_dimo_runs 32x32x7
    ................................
    .............##.................
    ............####................
    .......###..######..............
    .......#######....##............
    ........#####.....###...........
    ........###.###..#####..........
    .........#.#####.####.#.........
    .......###.###.######.#.........
    ......####.###.#.......##.......
    .......##..#####...#.....#......
    ........##..###...##....##.....
    .........#..............#.......
    .......###..............#.......
    ......####............##........
    ........#####.....####..........
    ........###.#........#..........
    ......###.........####..........
    ......##.....#...#....##........
    ......##....##..#.....#.#.......
    ....##....##....#.....#..#......
    ...##....##.....#.....#..##.....
    ##.####.#.......#.....##.##.....
    #..###.#..#.#...#.....#.###.....
    .#.......#..##..#....#..........
    ..#....###...###....##..........
    ...####..#....##...#.#..........
    ........#.....###.#..#..........
    ........##....#.#....##.........
    ........######...#.####.........
    .........###......###...........
    ................................

    ................................
    ..............##................
    .............####...............
    ........###.######..............
    .......#######....##............
    ........#####.....###...........
    ........###.###..#####..........
    .........#.#####.####.#.........
    .......###.###.######.#.........
    .......###.###.#.......##.......
    ......###..#####...#.....#......
    ........##..###...##....##......
    .........#..............#.......
    ......####..............#.......
    .......###............##........
    ........#####.....####..........
    ...... ...##.#.......#..........
    ....... ###........###..........
    .......###.. ... .#..#..........
    ....... ##...##..  #..#.........
    ....  ####...#... #...#.........
    ...# ..##.#...##..#...##........
    ..###.###..#.##. #....##........
    ######......##.. #....##........
    ##................#...#.........
    ..##....##...###...###..........
    ....####.#....##...#.#..........
    ..........#.....###.#...........
    ...........##....#.#............
    ...........######.###...........
    .............###.###............
    ................................

    ................................
    ..............##................
    .............####...............
    ........###..######.............
    ........#######....##...........
    .........#####.....###..........
    .........###.###..#####.........
    ..........#.#####.####.#........
    ........###.###.######.#........
    .......####.###.#.......##......
    ........##..#####...#.....#.....
    .........##..###...##....##.....
    ..........#..............#......
    ........###..............#......
    .......####............##.......
    .........#####.....####.........
    .........##.#........#..........
    .....  .#.#.........#.#.........
    ....  #.##....#...  #.#.........
    ....  ##.... .##....#.#.........
    ...  ###.#. ....###.#.#.........
    ..  . #..##......##.##..........
    ..# ####...#..####..#...........
    ..####......####. ..#...........
    .##......#....... .#............
    #####...##....... ##............
    .....###...###......#...........
    .........#...##..... #..........
    ........##....###...###.........
    .........######.######..........
    .........###......##............
    ................................

    ................................
    ..............##................
    .............####...............
    ........###.######..............
    .......#######....##............
    ........#####.....###...........
    ........###.###..#####..........
    .........#.#####.####.#.........
    .......###.###.######.#.........
    .......###.###.#.......##.......
    ......###..#####...#.....#......
    ........##..###...##....##......
    .........#..............#.......
    ......####..............#.......
    .......###............##........
    ........#####.....####..........
    ...... ...##.#.......#..........
    ....... ###........###..........
    .......###.. ... .#..#..........
    ....... ##...##..  #..#.........
    ....  ####...#... #...#.........
    ...# ..##.#...##..#...##........
    ..###.###..#.##. #....##........
    ######......##.. #....##........
    ##................#...#.........
    ..##....##...###...###..........
    ....####.#....##...#.#..........
    ..........#.....###.#...........
    ...........##....#.#............
    ...........######.###...........
    .............###.###............
    ................................

    ! eek
    ................................
    .............##.................
    ............####................
    .......###..######..............
    .......#######....##............
    ........#####.....###...........
    ........###.###..#.#.#..........
    .........#.#####.##.##.........
    .......###.#.#.#.#.#.##.........
    ......####.##.##.......##.......
    .......##..#.#.#.........#......
    ........##..###...##....##.....
    .........#.........#....#.......
    .......###.....###......#.......
    ......####....#.#.#....##........
    ........#####.##...###..........
    ........###.#........#..........
    ......###.........####..........
    ......##.....#...#....##........
    ......##....##..#.....#.#.......
    ....##....##....#.....#..#......
    ...##....##.....#.....#..##.....
    ##.####.#.......#.....##.##.....
    #..###.#..#.#...#.....#.###.....
    .#.......#..##..#....#..........
    ..#....###...###....##..........
    ...####..#....##...#.#..........
    ........#.....###.#..#..........
    ........##....#.#....##.........
    ........######...#.####.........
    .........###......###...........
    ................................

    ! kaput
    ................................
    ................................
    ................................
    ................................
    ................................
    ................................
    ................................
    ................................
    ................................
    ................................
    ......#######........##.........
    ...######...##......###.........
    ..#.###.###......##.####........
    .#..#.###....##...##....#.......
    .#..###......###.###.###.#......
    #...##....##.######.######......
    #..##.....#####.#...#.#.#.#..##.
    #..##..##.##....#...##.######.#.
    #..##..####.........#.#.#...#..#
    .#.######...........#####......#
    ...###.#..#.#..................#
    .#.......#..##..#..#...........#
    ..#...#.##...###...............#
    ...####..#....##...#.#..##.....#
    ....##..##....#......#.........#
    ..###...##....###....##.#######.
    ...##...#####....###########.###
    ....########......###.....#####.
    ................................
    ................................
    ................................
    ................................

    ! wave
    ................................
    .............##.................
    ............####................
    .......###..######..............
    .......#######....##............
    ........#####.....###...........
    ........###.###..#####..........
    .........#.#####.##.###..#......
    .......###.##.#####.###.####....
    ......####.##.##......##.###....
    .......##..#####...#...#.####...
    ........##..###...##...#...#....
    .........#.............#...#....
    .......###....#..#####.#.##.....
    ......####.....#.######..#......
    ........#####.#.######..#.......
    .........##.#..#.......#........
    ........#.......#####. #.........
    .......#.....#...#...##.........
    ......##....##..#.....#.........
    ....##....##....#.....#.........
    ...##....##.....#.....#.........
    ##.####.#.......#.....#.........
    #..###.#..#.#...#.....#.........
    .#.......#..##..#....#..........
    ..#....###...###....##..........
    ...####..#....##...#.#..........
    ........#.....###.#..#..........
    ........##....#.#....##.........
    ........######...#.####.........
    .........###......###...........
    ................................
  `);

  gfxClouds = game.loadGraphics(
    `PROGMEM const unsigned char gfxClouds[] = { /* 20x16x1 */
      0x1c, 0x22, 0x22, 0x22, 0x24, 0x10, 0x12, 0x2a, 0x21, 0x41,
      0x41, 0x41, 0x42, 0x4a, 0x24, 0x24, 0x18, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    };`
  );

  gfxCactus = game.loadGraphics(
    `PROGMEM const unsigned char gfxCactus[] = { /* 16x24x2 */
      0x00, 0x00, 0x00,  0x00, 0x00, 0x00,  0xfe, 0xff, 0xff,
      0xfe, 0x00, 0xc0,  0xc0, 0x80, 0x00,  0x00, 0x00, 0x00,
      0xfe, 0xff, 0xfe,  0x00, 0xff, 0xff,  0xff, 0xff, 0xc0,
      0xff, 0xff, 0x7f,  0x00, 0x00, 0x00,  0x00, 0x01, 0x03,
      0x03, 0x83, 0xff,  0xff, 0xff, 0xff,  0x80, 0x00, 0x00,
      0x00, 0x00, 0x00
      ,
      0x00, 0x00, 0x00,  0x00, 0x00, 0x00,  0x00, 0x00, 0x00,
      0x00, 0x00, 0x00,  0x00, 0x00, 0x00,  0x00, 0x00, 0x02,
      0xcf, 0x9e, 0xf0,  0xf8, 0xfc, 0xfc,  0xb8, 0x80, 0xf0,
      0x70, 0x00, 0x00,  0x00, 0x00, 0x00,  0x0c, 0x0d, 0x8b,
      0xbf, 0xff, 0xff,  0xbf, 0x8f, 0x03,  0x00, 0x00, 0x00,
      0x00, 0x00, 0x00
    };`
  );

  sfxBling = game.loadTune(
    `const byte PROGMEM score [] = {
         0x90, 71, 0,116, 0x80,
         0x90, 76, 1,222, 0x80,
         0xf0
    };`
  );

  sfxPlop = game.loadTune(
    `const byte PROGMEM score [] = {
         0x90, 47, 0, 33, 0x80,
         0x90, 41, 0, 50, 0x80,
         0xf0
    };`
  );

  sfxBoing = game.loadTune(
    `const byte PROGMEM score [] = {
         0x90, 57, 0, 33, 0x80,
         0x90, 69, 0, 83, 0x80,
         0xf0
    };`
  );

  sfxEek = game.loadTune(
  `const byte PROGMEM score [] = {
       0x90, 87, 0,50, 0x80,
       0x90, 82, 0,33, 0x80,
       0x90, 87, 0,66, 0x80,
       0xf0
  };`);

  sfxBust = game.loadTune(
    `const byte PROGMEM score [] = {
         0x90, 47, 0, 50, 0x80,
         0x90, 41, 0, 99, 0x80,
         0xf0
    };`
  );

  // Baseline height for ground and gfxDino
  baseline = game.height - 4;
  baselineDino = game.height - gfxDino.height;

  // Starting game state
  game.state = S_INTRO;

  //game.playbackRate = 1/3;
});


// Loop phase
// Run the game states
game.loop(function() {
  // Slows the game down when "down" button is pressed ("bullet time" :) )
  game.playbackRate = game.buttonPressed("down") ? 1/4 : 1;

  // Play intro animation
  if (game.state == S_INTRO) {
    // Skip intro animation
    if (game.buttonPressed("space")) return gameSetup();

    // Run intro animation
    let ended = game.run( gameIntro );
    if (!ended) return;

    // Intro animation ended, start the game
    return gameSetup();
  }

  // Clear display
  game.clear();

  // Flash active controls
  if (game.everyXFrames(5)) {
    if (game.buttonPressed("left")) {
      game.drawText("<", 80,50);
    }
    if (game.buttonPressed("right")) {
      game.drawText(">", 93,50);
    }
    if (game.buttonPressed("up")) {
      game.drawText("/\\", 84,45);
    }
    if (game.buttonPressed("down")) {
      game.drawText("\\/", 84,55);
    }
      if (game.buttonPressed("space")) {
      game.drawText("A", 102,50);
    }
    if (game.buttonPressed("enter")) {
      game.drawText("B", 110,50);
    }
  }

  if (game.state == S_PLAYING) {
    let ended = game.run( gamePlay );
    if (!ended) return;

    game.state = S_GAMEOVER;
    return;
  }

  if (game.state == S_GAMEOVER) {
    let ended = game.run( gameOver );

    // Restart game if "enter" (B) was pressed
    if (game.buttonPressed("space")) ended=true;

    if (!ended) return;

    return gameSetup();
  }

});


function *gameIntro() {

  //for(int i = -8; i < 39; i = i + 2)
  for (let y = -8;  y <= 38; y += 2) {
    game.clear();
    game.drawImage(gfxLogo, game.width/2-gfxLogo.width/2, 0 );

    //game.drawImage(gfxClouduboy, game.width/2-gfxClouduboy.width/2, y );
    yield 1; // essentially delay(16);
  }

  //game.drawText("presents", 42, 55);

  //arduboy.tunes.tone(987, 120);
  //delay(120);
  //arduboy.tunes.tone(1318, 400);
  sfxBling.play();


  // Flash the RGB led on the Arduboy or the screen in the browser to a purple color!
  game.custom({
    canvas: `document.body.style.backgroundColor='rgb(96, 0, 128)'`,
    arduboy: `arduboy.setRGBled(96, 0, 128)`,
  });

  yield 6; // essentially delay(6*16);

  game.custom({
    canvas: `document.body.style.backgroundColor=''`,
    arduboy: `arduboy.setRGBled(0, 0, 0)`,
  });

  yield 60;


  let y = 12;
    //arduboy.drawBitmap(54-2, y-1,   dino,  20,18, BLACK);
    //arduboy.drawBitmap(54+1, y+1,   dino,  20,18, BLACK);
    game.clearImage(gfxDino[DINO_HELLO_FRAME], 54-2, y-1);
    game.clearImage(gfxDino[DINO_HELLO_FRAME], 54-2, y-1);
    game.clearImage(gfxDino[DINO_HELLO_FRAME], 54-2, y-1);
    game.clearImage(gfxDino[DINO_HELLO_FRAME], 54+1, y+1);
    game.clearImage(gfxDino[DINO_HELLO_FRAME], 54+1, y+1);
    game.clearImage(gfxDino[DINO_HELLO_FRAME], 54+1, y+1);

  //for (int i=0; i<12; ++i) {
  for (let frame = 0; frame <36; ++frame ) {
    let rx = Math.floor(Math.random()*(2+1)) -1; // = random(0,2)-1;
    let ry = Math.floor(Math.random()*(2+1)) -1;
    let noise = 0;// (frame%6>2 ? frame : -frame )/6;

    if (frame%3 === 0) {
      game.drawImage(gfxDino[DINO_HELLO_FRAME], rx+ 54, ry+ y);
      game.drawImage(gfxDino[DINO_HELLO_FRAME], rx+ 54, ry+ y);
      game.drawImage(gfxDino[DINO_HELLO_FRAME], rx+ 54, ry+ y);
    } else {
      game.clearImage(gfxDino[DINO_HELLO_FRAME], rx+ 54+noise, ry+ y+noise);
      game.clearImage(gfxDino[DINO_HELLO_FRAME], rx+ 54+noise, ry+ y+noise);
      game.clearImage(gfxDino[DINO_HELLO_FRAME], rx+ 54+noise, ry+ y+noise);
    }
    //arduboy.drawBitmap(rx+ 54+(i%2?i:-i)/2, ry+ y+(i%2?i:-i)/2,   dino_top,  20,18, BLACK);

    yield 1;
  }

  //for(; y < 41; y += 1+y/10)
  while ( y < baselineDino ) {
    //y += (frame + (frame>6?frame-6:0) + (frame>12?frame-12:0))|0;
    y += 1 + y/10;
    if (y > baselineDino) y = baselineDino;

    game.clear();
    game.drawImage(gfxLogo, game.width/2-gfxLogo.width/2, game.height/2-gfxLogo.height/2 );
    //game.drawImage(gfxClouduboy, game.width/2-gfxClouduboy.width/2, game.height/2-gfxLogo.height/2 );

    //game.drawText("pr   nts", 42, 55);
    //game.drawText("ese", 54, 55 + (y>32 ? y-32 : 0));

    game.clearImage(gfxDino[DINO_HELLO_FRAME], 54-2, y-1);
    game.clearImage(gfxDino[DINO_HELLO_FRAME], 54-2, y-1);
    game.clearImage(gfxDino[DINO_HELLO_FRAME], 54-2, y-1);
    game.clearImage(gfxDino[DINO_HELLO_FRAME], 54+1, y+1);

    game.drawImage(gfxDino[DINO_HELLO_FRAME], 54, y);

    yield 1;
  }

  //      arduboy.tunes.tone(246, 20);
  //      delay(20);
  //      arduboy.tunes.tone(174, 40);
  //new ArduboyScore("0x90, 47, 0, 33, 0x80, 0x90, 41, 0, 50, 0x80, 0xf0").play();
  sfxPlop.play();

  yield 120;


  //for (int i = 0; i < 64; ++i) {
  for (let i = 0; i < 64; ++i) {
    let z = i<54 ? i : 54;

    game.clearImage(gfxDino[DINO_HELLO_FRAME], 54-z+1, y);

    //arduboy.drawLine(0, i<32 ? i*2 : 127-i*2, 127,i<32 ? i*2 : 127-i*2, BLACK);
    game.clearRect(0, i<32 ? i*2 : 127-i*2, 128, 1);

    game.drawImage(gfxDino[DINO_HELLO_FRAME], 54-z, y);

    yield 1;
  }

  yield 10;
}


// Variable to hold the distance ran (basically: score)
let distance;

// Obstacle (cactus) current X position
let obsCactus1, obsCactus2;
let obsCactus1Y, obsCactus2Y;
let obsCactus1YType, obsCactus2YType;

// Global to track dino jump state
let dinoJumpFrame;

// Dino Y coordinate
let dinoJumpHeight = 0;

// Current running speed (screen pixels travelled per second)
let dinoRunSpeed;


// used by calculateNextStep for more precise speed
let calculateNextStepRemainder = 0;
function calculateNextStep(runSpeed) {
  let next = runSpeed/60|0;

  // Accummulate remainders for more accurate speed reproduction
  calculateNextStepRemainder += 100*runSpeed/60%100|0;

  // Extra frames needed
  while (calculateNextStepRemainder>50) {
    next++;
    calculateNextStepRemainder -= 100;
  }

  return next;
}

function calculateRunSpeed(distance, nextStep) {
  return START_SPEED
    + ( (distance+nextStep) /100|0)   // increase by 1 every 100m
    + ( (distance+nextStep) /500|0)*4 // increase by 5 every 500m
}

function *gamePlay() {
  // Next frame in which another meter will be travelled
  let nextStep;

  // Reset game setup to startup values
  gameSetup();

  // Run the game
  while (true) {
    // Calculate next step
    nextStep = calculateNextStep(dinoRunSpeed);

    // Increase distance (score) whilst running
    if ( nextStep ) {
      // Increase speed at every 100 px-s
      dinoRunSpeed = calculateRunSpeed(distance, nextStep);

      // Increase distance
      distance += nextStep;
    }

    // Update state
    updateTerrain(distance);
    updateDino();

    // Draw
    drawTerrain(distance);
    drawDino();
    drawUI();

    // Collision detection
    if (checkCollisions()) break;

    // Next frame
    yield 1;
  }
}

function *gameOver() {
  sfxEek.play();

  // KaputCam TM
  for(let i=0; i<24; i++) {

    drawTerrain(distance);

    if (i!=7 && i!=8 && i!= 16 && i!=17) {
      game.drawImage(gfxDino[DINO_EEK_FRAME], 0,baselineDino-dinoJumpHeight);
    }

    drawUI();
    checkCollisions(); // only here for the UI drawing part

    yield 1;
  }

  // Bust
  let falling = true;
  let nextStep;
  let fallDistance = distance;

  while (true) {

    // Fall
    if (dinoJumpHeight > -4) {
      dinoJumpHeight -= 1;
    }
    if (falling && dinoJumpHeight <= -4) {
      dinoJumpHeight = -4;
      sfxBust.play();
      falling = false;
    }

    // Gently slide off into the ground
    if (dinoRunSpeed>0) {
      nextStep = calculateNextStep(dinoRunSpeed);
      dinoRunSpeed -= 1;
      fallDistance += nextStep;
    }

    updateTerrain(fallDistance);
    drawTerrain(fallDistance);

    baselineDino - dinoJumpHeight;

    game.drawImage(gfxDino[DINO_KAPUT_FRAME], 0,baselineDino-dinoJumpHeight);

    drawUI();

    yield 1;
  }


}

function gameSetup() {
  // Switch game state
  game.state = S_PLAYING;

  // Reset distance (score)
  distance = 0;

  // Reset speed
  dinoRunSpeed = START_SPEED;

  // Cactus position
  obsCactus1 = obsCactus2 = -game.width;
  updateTerrain(distance);

  dinoJumpFrame = 0;
  dinoJumpHeight = 0;
}

function updateTerrain(distance) {
  // Place a new cactus
  if (obsCactus1+gfxCactus.width < distance) {
    obsCactus1 = distance + 175 + 5*Math.floor(0 + Math.random()*(10-0+1));
    obsCactus1Y = game.random(baseline+1,game.height) - gfxCactus.height;
  }

  // Place a second cactus
  if (distance > 500) {
    if (obsCactus2+gfxCactus.width < distance) {
      obsCactus2 = distance + 200 + 6*Math.floor(0 + Math.random()*(10-0+1));
      obsCactus2Y = game.random(baseline+1,game.height) - gfxCactus.height;
    }

    // Make sure placement of cactii is not *too* evil :)
    let obsDistance = obsCactus2-obsCactus1;

    // too dense
    if (obsDistance > 0 && obsDistance < gfxCactus.width/2) {
      obsCactus2 += gfxCactus.width/2|0;
    }
    if (obsDistance < 0 && obsDistance > gfxCactus.width/-2) {
      obsCactus1 += gfxCactus.width/2|0;
    }

    // too close
    obsDistance = obsCactus2-obsCactus1;
    if (obsDistance > gfxCactus.width+5 && obsDistance < gfxCactus.width+gfxDino.width) {
      obsCactus2 += gfxDino.width;
    }
    if (obsDistance < -(gfxCactus.width+5) && obsDistance > -(gfxCactus.width+gfxDino.width)) {
      obsCactus1 += gfxDino.width;
    }

  }
}

function updateDino() {
  // Only in-game
  if (game.state === S_PLAYING) {
    if (!dinoJumpFrame && (game.buttonPressed("space") || game.buttonPressed("up"))) {
      dinoJumpFrame = 1;
      dinoJumpHeight=5;

      sfxBoing.play();

    } else if (dinoJumpFrame) {
      ++dinoJumpFrame;

      if (dinoJumpFrame<6) {
        dinoJumpHeight +=6;
      } else if (dinoJumpFrame<9) {
        dinoJumpHeight +=2;
      } else if (dinoJumpFrame<13) {
        dinoJumpHeight +=1;
      } else if (dinoJumpFrame == 16 || dinoJumpFrame == 18) {
        dinoJumpHeight +=1;
      } else if (dinoJumpFrame == 20 || dinoJumpFrame == 22) {
        dinoJumpHeight -=1;
      } else if (dinoJumpFrame>38) {
        dinoJumpHeight = 0;
        dinoJumpFrame = 0;
      } else if (dinoJumpFrame>32) {
        dinoJumpHeight -=6;
      } else if (dinoJumpFrame>29) {
        dinoJumpHeight -=2;
      } else if (dinoJumpFrame>25) {
        dinoJumpHeight -=1;
      }
    }
  }
}

function drawTerrain(distance) {
  // Parallax scrolling gfxClouds
  game.drawImage(gfxClouds[0], game.width -(distance%(game.width+gfxClouds.width)),5);

  // Terrain
  if (dinoJumpHeight > 4) {
    game.fillRect( 0,baseline, game.width,1);
  } else {
    game.fillRect( 0,baseline, DINO_SHADOW_START,1);
    game.fillRect(DINO_SHADOW_START+DINO_SHADOW_SIZE,baseline, game.width-DINO_SHADOW_START-DINO_SHADOW_SIZE,1); // => drawLine(x,y, x+w-1, y+h-1, WHITE )
  }

  // Obstacles
  let c1 = obsCactus1-distance;
  let c2 = obsCactus2-distance;
  if (c1 < game.width) game.drawImage(gfxCactus[0], c1,obsCactus1Y);
  if (c2 < game.width) game.drawImage(gfxCactus[1], c2,obsCactus2Y);
}

function drawDino() {
  let dy = baselineDino - dinoJumpHeight;


  // Run, gfxDino, Run!
  if (!dinoJumpHeight) {
    game.drawImage(gfxDino[ (game.frameCount/10|0)%4 ], 0,dy, gfxDino.width,gfxDino.height);
    //game.drawImage(gfxDinoLegs[ (distance/10|0)%2 ], 0,dy+18);
  } else {
    game.drawImage(gfxDino[0], 0,dy, gfxDino.width,gfxDino.height);
  }
}

function drawUI() {
  // hud
  //arduboy.setCursor(0, 0);
  //sprintf(text,"DIST: %d",d);
  //game.drawText("DIST: " + (distance/10|0) + " SPD: " + dinoRunSpeed, 0,0);
  game.custom({
    canvas: `game.drawText("DIST: " + (distance/10|0) + " SPD: " + dinoRunSpeed, 0,0)`,
    arduboy: `arduboy.setCursor(0, 0);
              sprintf(_microcanvas_textbuffer, "DIST: %d  SPD: %d", (distance/10), dino_run_speed);
              arduboy.print(_microcanvas_textbuffer);`
  });
}

function checkCollisions() {
  let c1 = obsCactus1 - distance;
  let c2 = obsCactus2 - distance;
  let dy = baselineDino - dinoJumpHeight;
  let hit = false;

  hit = hit
    || ( c1<=gfxDino.width && game.detectCollision(gfxDino[0], 0,dy, gfxCactus[0], c1,obsCactus1Y) )
    || ( c2<=gfxDino.width && game.detectCollision(gfxDino[0], 0,dy, gfxCactus[1], c2,obsCactus1Y) );

  return hit;
}


console.log("MicroCanvas initialized: Dino Run (Mozilla ID 'Dimo' Edition)");
