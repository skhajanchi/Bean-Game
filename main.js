/* Thanks to Jake from Clarity Coders for helping me make this game. I used the help of a tutorial to make this:
https://www.youtube.com/watch?v=37rASpfnCCM
*/

import kaboom from "kaboom"
// import fs from "fs"
let level_coins = {
  'level_1': 0,
  'level_2': 0,
  'level_3': 0,
  'level_4': 0,
  'level_5': 0,
  'level_6': 0,
  'level_7': 0,
}

// initialize context
kaboom({
  background: [100, 100, 0]
})

// load assets
loadSprite("bean", "sprites/bean.png");
loadSprite("ghosty", "sprites/ghosty.png");
loadSprite("grass", "sprites/grass.png");
loadSprite("portal", "sprites/portal.png");
loadSprite("coin", "sprites/coin.png");
loadSound("portal", "sounds/portal.mp3");
loadSound("hit", "sounds/hit.mp3");
loadSound("blip", "sounds/blip.mp3");
loadSound("score", "sounds/score.mp3");

const P_SPEED = 200
const P_JUMP = 800
const GHOST_SPEED = 100

let level_id = 0
let deaths = 0
let coins = 0
let level = 1

scene('game', ({level_id, deaths, coins}) => {
  if (level_id == 0) {
    start_time = time()
  }

  maps = [
    [
    '                  ',
    ' @            @*  ',
    ' ==           ==  ',
    '     @   ===      ',
    '     =            ',
    '                  ',
    ],
    [
    '  ^               ',  
    '    ^           * ',
    '         ^    @   ',
    ' @       @   ===  ',
    ' =====            ',
    '         ===      ',
    ],
    [
    '     @   @   ^     ',
    '     ===           ',
    ' @   ^     *       ',
    '===                ',
    ],
    [
    '        ^           ',
    '                    ',
    '  ^     @           ',
    ' @                @ *',
    '====   ===   ====== ',
    ],
    [
    '          ^       ',
    '    ^             ',
    '                  ',
    '    @     ^ @*    ',
    '  = =    @        ',
    '==      ==        ',
    ],
    [
    '          ^       ',
    '    ^         @  *',
    '        ^         ',
    '    @       ===   ',
    '  ==     @        ',
    '=      ==         ',
    ],
    [
    '          ^       ',
    '    ^             ',
    '====        ^     ',
    '     @    ^       ',
    '     =   @        ',
    '        ==        ',
    '            @*    ',
    ],
  ]

  current_map = maps[level_id]
  
  const level_one = {
    width: 64,
    height: 64,
  
    '=': () => [
      sprite('grass'),
      'block',
      area(),
      solid(),
    ],

    '^': () => [
      sprite('ghosty'),
      'ghosty',
      'enemy',
      area(),
      {
        speed: GHOST_SPEED
      },
        ],
    
    '*': () => [
      sprite('portal'),
      'portal',
      area(),
    ],

    '@': () => [
      sprite('coin'),
      'coin',
      area(),
    ],
  }

  let level_num = add([
    text('Level ' + (level_id + 1)),
    pos(0,0),
    scale(.75),
    fixed(),
  ])

  let death_count = add([
    text('Deaths: ' + deaths),
    pos(0, 50),
    scale(.75),
    fixed(),
  ])

  let coin_count = add([
    text(coins + ' Coins'),
    pos(0, 100),
    scale(.75),
    fixed(),
  ])
  
  const pro = add([
    sprite('bean'),
    pos(50, 10),
    area(),
    body(),
    scale(.75),
    'player'
  ])
  
  onKeyDown('right', () => {
      pro.flipX(false)
      pro.move(P_SPEED, 0)
  })

   onKeyDown('d', () => {
      pro.flipX(false)
      pro.move(P_SPEED, 0)
  })
  
  onKeyDown('left', () => {
      pro.flipX(true)
      pro.move(-P_SPEED, 0)
  })
  
  onKeyDown('a', () => {
      pro.flipX(true)
      pro.move(-P_SPEED, 0)
  })
  
  onKeyDown('up', () => {
      if (pro.grounded()) {
        pro.jump(P_JUMP)
      }
  })


  onKeyDown('w', () => {
      if (pro.grounded()) {
        pro.jump(P_JUMP)
      }
  })

  
  onKeyDown('space', () => {
      if (pro.grounded()) {
        pro.jump(P_JUMP)
      }
  })

  pro.collides('enemy', (enemy) => {
    if (enemy.pos.y < pro.pos.y) {
      pro.destroy()
      play('blip')
      go('lose')
    }
    else {
      enemy.destroy()
      play('hit')
      pro.jump(500)
    }
  })

  pro.action(() => {
    camPos(pro.pos)
    if (pro.pos.y > 2000) {
      play("blip")
      go('lose')
      deaths++
      death_count.destroy()
      death_count = add([
    text('Deaths: ' + deaths),
    pos(0, 50),
    scale(.75),
    fixed(),
  ])
    }
  })

  action('ghosty', (g) => {
        g.move(g.speed, 0)

        if (g.pos.x > 1000 || g.pos.x < -100){
            g.speed *= -1
        }
    })


  pro.collides('coin', (c) => {
    c.destroy()
    coins++
    level_coins[`level_${level_id + 1}`]++
    coin_count.destroy()
    if (coins == 1) {
      coin_count = add([
    text('1 Coin'),
    pos(0, 100),
    scale(.75),
    fixed(),
  ])
    }
    else {
      coin_count = add([
    text(coins + ' Coins'),
    pos(0, 100),
    scale(.75),
    fixed(),
  ])
    play('score')
  }
    }
)
  pro.collides('portal', (p) => {
    p.destroy()
    play('portal')
    level_id++
    level++
    if (level_id < maps.length) {
      go('game', {level_id, deaths, coins})
    }
    else {
      go('win', {start_time})
    }
  })
  
 const game_level = addLevel(current_map, level_one)
})

scene('lose', () => {
  add([
    text('YOU LOST \n PRESS ANY KEY TO TRY AGAIN'),
    scale(0.7),
    color(0, 0, 255),
    origin('center'),
    pos(width() / 2, height() / 2),
  ])

  onKeyPress(() => {
    deaths++
    level_coins[`level_${level}`] = 0
    coins = level_coins.level_1 + level_coins.level_2 + level_coins.level_3 + level_coins.level_4 + level_coins.level_5 + level_coins.level_6 + level_coins.level_7
    go('game', {
    level_id: level - 1,
    deaths: deaths,
    coins: coins,
  })
})
})

scene('win', ({start_time}) => {
  add([
    text('YOU WIN\nPRESS ANY KEY TO TRY TO\nWIN AGAIN\nTime: ' + (time() - start_time).toFixed(3) + ' seconds\nCoins Collected in Playthrough(s): ' + (level_coins.level_1 + level_coins.level_2 + level_coins.level_3 + level_coins.level_4 + level_coins.level_5 + level_coins.level_6 + level_coins.level_7)),
    scale(0.4),
    color(0, 255, 0),
    origin('center'),
    pos(width() / 2, height() / 2),
  ])


  onKeyPress(() => {
  go('game', {
    level_id: 0,
    deaths: 0,
    coins: 0,
  })
})
})


go('game', {level_id, deaths, coins})
