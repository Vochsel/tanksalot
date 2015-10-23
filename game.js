// Generated by CoffeeScript 1.10.0
var AttractScreen, Game, MainScreen, TAU, audioCtx, canvas, ctx, didLoad, dist2, doneLoading, fn, id, loaded, mixer, muted, objectives, play, s, sfx, sounds, speed, spritesheet, toggleMute, update, url, within,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

canvas = atom.canvas;

canvas.width = 800;

canvas.height = 600;

ctx = atom.ctx;

ctx.translate(400, 300);

ctx.scale(1, -1);

if (/Windows.*Chrome\/16/.test(navigator.userAgent)) {
  canvas.style.borderRadius = 0;
}

audioCtx = atom.audioContext;

id = 0;

speed = 100;

TAU = Math.PI * 2;

update = function(dt, obj, speed) {
  obj.x += speed * dt * Math.cos(obj.angle);
  return obj.y += speed * dt * Math.sin(obj.angle);
};

dist2 = function(a, b) {
  var dx, dy;
  dx = a.x - b.x;
  dy = a.y - b.y;
  return dx * dx + dy * dy;
};

within = function(a, b, dist) {
  return dist2(a, b) < dist * dist;
};

objectives = [
  {
    name: 'win box',
    text: 'Get the box'
  }, {
    name: 'win box',
    text: 'Get the box'
  }, {
    name: 'win',
    text: 'Make your team win'
  }, {
    name: 'win',
    text: 'Make your team win'
  }, {
    name: 'last alive',
    text: 'Be the last tank alive'
  }, {
    name: 'kill 3',
    text: 'Kill 3 tanks'
  }, {
    name: 'win box timelimit',
    text: 'Get the box within 15 seconds'
  }, {
    name: 'killed by tank 1',
    text: 'Get killed by the first tank'
  }, {
    name: 'win box',
    text: 'Get the box'
  }, {
    name: 'pileup',
    text: 'Cause a 3-tank pileup'
  }
];

sounds = {};

loaded = 0;

didLoad = function() {
  loaded++;
  if (loaded === 8) {
    return doneLoading();
  }
};

window.onload = didLoad;

muted = false;

sfx = {
  shoot: 'shoot.wav',
  crash: 'crash.wav',
  explode: 'explode.wav',
  win: 'win.wav',
  youdie: 'youdie.wav',
  thud: 'thud.wav'
};

spritesheet = new Image;

spritesheet.src = 'tanks.png';

spritesheet.onload = function() {
  return didLoad();
};

fn = function(s, url) {
  return atom.loadSound("sounds/" + url, function(error, buffer) {
    if (error) {
      console.error(error);
    }
    if (buffer) {
      sounds[s] = buffer;
    }
    return didLoad();
  });
};
for (s in sfx) {
  url = sfx[s];
  fn(s, url);
}

mixer = audioCtx != null ? audioCtx.createGainNode() : void 0;

if (mixer != null) {
  mixer.connect(audioCtx.destination);
}

play = function(name, time) {
  var source;
  if (!(sounds[name] && audioCtx)) {
    return;
  }
  source = audioCtx.createBufferSource();
  source.buffer = sounds[name];
  source.connect(mixer);
  source.noteOn(time != null ? time : 0);
  return source;
};

toggleMute = function() {
  var e, j, k, len, len1, ref, ref1, results, results1;
  if (!muted) {
    muted = true;
    if (mixer != null) {
      mixer.gain.value = 0;
    }
    ref = document.getElementsByTagName('audio');
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      e = ref[j];
      results.push(e.volume = 0);
    }
    return results;
  } else {
    muted = false;
    if (mixer != null) {
      mixer.gain.value = 1;
    }
    ref1 = document.getElementsByTagName('audio');
    results1 = [];
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      e = ref1[k];
      results1.push(e.volume = 1);
    }
    return results1;
  }
};

AttractScreen = (function() {
  function AttractScreen(game1) {
    var ref, ref1, ref2;
    this.game = game1;
    this.music = document.getElementById('menu');
    try {
      if (!((ref = this.music) != null ? ref.currentTime : void 0)) {
        if ((ref1 = this.music) != null) {
          ref1.currentTime = 0;
        }
        if ((ref2 = this.music) != null) {
          ref2.play();
        }
      }
    } catch (undefined) {}
  }

  AttractScreen.prototype.update = function() {
    if (atom.input.pressed('click') || atom.input.pressed('shoot')) {
      if (atom.input.mouse.x > 700 && atom.input.mouse.y > 500) {
        return toggleMute();
      } else {
        return this.game.enter(new MainScreen(this.game));
      }
    }
  };

  AttractScreen.prototype.draw = function() {
    ctx.fillStyle = 'rgb(215,232,148)';
    ctx.fillRect(-400, -300, 800, 600);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgb(32,70,49)';
    ctx.save();
    ctx.scale(1, -1);
    ctx.font = '60px KongtextRegular';
    ctx.fillText('Tanks a lot!', 0, -80, 600);
    ctx.font = '20px KongtextRegular';
    ctx.fillText('Press space to start', 0, 20, 600);
    if (!muted) {
      ctx.drawImage(spritesheet, 94 * 2, 99 * 2, 20, 20, 360, 260, 20, 20);
    } else {
      ctx.drawImage(spritesheet, 81 * 2, 99 * 2, 20, 20, 360, 260, 20, 20);
    }
    ctx.drawImage(spritesheet, 209 * 2, 10 * 2, 179 * 2, 38 * 2, -178, 130, 179 * 2, 38 * 2);
    return ctx.restore();
  };

  AttractScreen.prototype.exit = function() {
    var ref, ref1;
    if ((ref = this.music) != null) {
      ref.autoplay = false;
    }
    return (ref1 = this.music) != null ? ref1.pause() : void 0;
  };

  return AttractScreen;

})();

MainScreen = (function() {
  function MainScreen(game1) {
    var i, j;
    this.game = game1;
    this.background = [];
    for (i = j = 0; j <= 26; i = ++j) {
      this.background.push({
        tile: Math.floor(Math.random() * 5),
        x: Math.floor(Math.random() * 800) - 400,
        y: Math.floor(Math.random() * 600) - 300
      });
    }
    this.music = document.getElementById('music');
    this.state = '';
    this.startGame();
  }

  MainScreen.prototype.enter = function() {
    var ref, ref1, ref2;
    try {
      if (!((ref = this.music) != null ? ref.currentTime : void 0)) {
        if ((ref1 = this.music) != null) {
          ref1.currentTime = 0;
        }
        return (ref2 = this.music) != null ? ref2.play() : void 0;
      }
    } catch (undefined) {}
  };

  MainScreen.prototype.exit = function() {
    var ref;
    return (ref = this.music) != null ? ref.pause() : void 0;
  };

  MainScreen.prototype.startRound = function() {
    this.state = 'round starting';
    this.stateTick = 0;
    return this.reset();
  };

  MainScreen.prototype.startGame = function() {
    this.mode = 'sp';
    this.score = 0;
    this.tanks = [];
    this.nextId = 0;
    this.currentTank = null;
    this.startRound();
    return this.round = 0;
  };

  MainScreen.prototype.endGame = function() {
    var req;
    req = new XMLHttpRequest;
    req.open('POST', 'http://libris.nornagon.net/jca/tanks.cgi', true);
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.send(JSON.stringify({
      tanks: this.tanks.map(function(t) {
        return {
          id: t.id,
          team: t.team,
          history: t.history
        };
      }),
      score: this.score,
      round: this.round
    }));
    return this.state = 'game over';
  };

  MainScreen.prototype.endRound = function(winteam) {
    if (this.currentTank.team !== winteam) {
      this.endGame();
    } else {
      this.state = 'round over';
    }
    return this.stateTick = 0;
  };

  MainScreen.prototype.reset = function() {
    var j, len, ref, tank;
    this.round++;
    if ((this.mode === 'puzzle' && this.nextId === 10) || (this.mode === 'sp' && this.nextId === 40)) {
      this.endGame();
    }
    this.currentTank = {
      team: !!(this.nextId % 2),
      id: this.nextId++,
      history: []
    };
    this.tanks.push(this.currentTank);
    ref = this.tanks;
    for (j = 0, len = ref.length; j < len; j++) {
      tank = ref[j];
      tank.x = 300;
      if (tank.team) {
        tank.angle = 0;
      } else {
        tank.angle = TAU / 2;
      }
      if (tank.id >= 20) {
        tank.x += 50;
      }
      switch (this.mode) {
        case 'sp' || 'mp':
          tank.y = Math.floor((tank.id % 20) / 2) * 50 - 225;
          break;
        case 'puzzle':
          tank.y = Math.floor(tank.id / 2) * 100 - 200;
      }
      if (tank.team) {
        tank.x = -tank.x;
        tank.y = -tank.y;
      }
      tank.alive = true;
      tank.lastShot = -Infinity;
      tank.distance = 10000;
      tank.kills = 0;
    }
    this.tick = 0;
    return this.bullets = [];
  };

  MainScreen.prototype.update = function(dt) {
    var a, actions, aliveTanks, b, bullet, i, j, k, l, len, len1, len2, len3, len4, len5, len6, len7, len8, m, n, o, p, q, r, ref, ref1, ref10, ref11, ref12, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, results, secs, t, tank;
    dt = 1 / 60;
    this.stateTick++;
    if (atom.input.pressed('click') && atom.input.mouse.x > 700 && atom.input.mouse.y > 500) {
      toggleMute();
    }
    if (this.state === 'game over' && this.stateTick >= 80) {
      if (atom.input.pressed('click') || atom.input.pressed('shoot')) {
        if (atom.input.mouse.x > 700 && atom.input.mouse.y > 500) {
          toggleMute();
        } else {
          this.startGame();
        }
      }
    }
    if (this.state === 'round starting') {
      secs = 3 - Math.floor(this.stateTick / 35);
      if (secs < 0) {
        this.state = 'game';
      }
    }
    if (this.state === 'round over') {
      if (this.stateTick <= 25) {
        this.score += 4;
      }
      if (this.stateTick > 70) {
        this.startRound();
      }
    }
    if (atom.input.pressed('reset')) {
      this.reset(this.currentTank.team);
    }
    if (this.state !== 'game') {
      return;
    }
    actions = 0;
    if (atom.input.down('up')) {
      actions |= 1;
    } else if (atom.input.down('down')) {
      actions |= 2;
    }
    if (atom.input.down('left')) {
      actions |= 4;
    }
    if (atom.input.down('right')) {
      actions |= 8;
    }
    if (atom.input.pressed('shoot')) {
      actions |= 0x10;
    }
    if (atom.input.down('shoot')) {
      actions |= 0x20;
    }
    this.currentTank.history.push(actions);
    ref = this.tanks;
    for (j = 0, len = ref.length; j < len; j++) {
      tank = ref[j];
      if (!tank.alive) {
        continue;
      }
      actions = tank.history[this.tick];
      if (actions & 1) {
        tank.distance++;
        update(dt, tank, 140);
      } else if (actions & 2) {
        tank.distance--;
        update(dt, tank, -80);
      }
      if (actions & 4) {
        tank.angle += 2 * dt;
      }
      if (actions & 8) {
        tank.angle -= 2 * dt;
      }
      if ((actions & 0x10 && tank.lastShot < this.tick - 15) || (actions & 0x20 && tank.lastShot < this.tick - 30)) {
        tank.lastShot = this.tick;
        this.bullets.push({
          x: tank.x,
          y: tank.y,
          angle: tank.angle,
          team: tank.team,
          owner: tank.id,
          alive: true
        });
        play('shoot');
      }
    }
    i = 0;
    while (i < this.bullets.length) {
      bullet = this.bullets[i];
      update(dt, bullet, 300);
      if (!((-450 < (ref1 = bullet.x) && ref1 < 450) && (-350 < (ref2 = bullet.y) && ref2 < 350)) || !bullet.alive) {
        this.bullets[i] = this.bullets[this.bullets.length - 1];
        this.bullets.length--;
      } else {
        i++;
      }
    }
    ref3 = this.tanks;
    for (k = 0, len1 = ref3.length; k < len1; k++) {
      t = ref3[k];
      if (!t.alive) {
        continue;
      }
      if (!((-385 < (ref4 = t.x) && ref4 < 385) && (-285 < (ref5 = t.y) && ref5 < 285))) {
        t.alive = false;
        play('crash');
      }
    }
    ref6 = this.tanks;
    for (l = 0, len2 = ref6.length; l < len2; l++) {
      a = ref6[l];
      ref7 = this.tanks;
      for (m = 0, len3 = ref7.length; m < len3; m++) {
        b = ref7[m];
        if (a === b || !a.alive && !b.alive) {
          continue;
        }
        if (within(a, b, 30)) {
          a.alive = b.alive = false;
          play('crash');
        }
      }
    }
    ref8 = this.tanks;
    for (n = 0, len4 = ref8.length; n < len4; n++) {
      t = ref8[n];
      ref9 = this.bullets;
      for (o = 0, len5 = ref9.length; o < len5; o++) {
        b = ref9[o];
        if (b.owner === t.id) {
          continue;
        }
        if (within(t, b, 20)) {
          if (t.alive) {
            if (b.owner === this.currentTank.id) {
              this.score += 10;
            }
            play('explode');
          } else {
            play('thud');
          }
          t.alive = b.alive = false;
        }
      }
    }
    aliveTanks = 0;
    ref10 = this.tanks;
    for (p = 0, len6 = ref10.length; p < len6; p++) {
      t = ref10[p];
      if (t.alive && (t.history[this.tick] != null)) {
        aliveTanks++;
      }
    }
    if (!aliveTanks) {
      return this.endRound(null);
    }
    if (aliveTanks === 1) {
      ref11 = this.tanks;
      for (q = 0, len7 = ref11.length; q < len7; q++) {
        t = ref11[q];
        if (t.alive) {
          tank = t;
        }
      }
      if (tank === this.currentTank) {
        this.achieved('last alive');
      }
    }
    this.tick++;
    ref12 = this.tanks;
    results = [];
    for (r = 0, len8 = ref12.length; r < len8; r++) {
      t = ref12[r];
      if (within(t, {
        x: 0,
        y: 0
      }, 32)) {
        if (t === this.currentTank) {
          this.achieved('win box');
          if (this.tick <= 60 * 15) {
            this.achieved('win box timelimit');
          }
        }
        if (t.team === this.currentTank.team) {
          play('win');
          this.achieved('win');
        } else {
          play('youdie');
        }
        results.push(this.endRound(t.team));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  MainScreen.prototype.achieved = function(thing) {
    if (thing !== 'last alive') {
      return console.log('done', thing);
    }
  };

  MainScreen.prototype.draw = function() {
    var bullet, frame, j, k, len, len1, ref, ref1, secs, sprite, tank;
    ctx.fillStyle = 'rgb(215,232,148)';
    ctx.fillRect(-400, -300, 800, 600);
    this.drawBackground();
    ref = this.bullets;
    for (j = 0, len = ref.length; j < len; j++) {
      bullet = ref[j];
      ctx.save();
      ctx.translate(bullet.x, bullet.y);
      ctx.rotate(bullet.angle + TAU / 4);
      frame = Math.floor(this.tick / 3) % 3;
      ctx.drawImage(spritesheet, 32 + 8 * frame, 96, 6, 18, -3, -9, 6, 18);
      ctx.restore();
    }
    ref1 = this.tanks;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      tank = ref1[k];
      ctx.save();
      ctx.translate(tank.x, tank.y);
      ctx.rotate(tank.angle + TAU / 4);
      if (tank === this.currentTank) {
        ctx.lineWidth = 1.5;
        if (tank.team) {
          ctx.strokeStyle = 'rgb(32,70,49)';
        } else {
          ctx.strokeStyle = 'rgb(70,76,33)';
        }
        ctx.strokeRect(-18, -18, 36, 36);
      }
      sprite = tank.team ? 0 : 1;
      if (tank.alive) {
        frame = Math.floor(tank.distance / 2) % 4;
        ctx.drawImage(spritesheet, 64 + frame * 32, 96 + sprite * 32, 32, 32, -16, -16, 32, 32);
      } else {
        ctx.drawImage(spritesheet, 64, 192 + sprite * 32, 32, 32, -16, -16, 32, 32);
      }
      ctx.restore();
    }
    ctx.save();
    ctx.scale(1, -1);
    ctx.drawImage(spritesheet, 224, 64, 64, 64, -32, -48, 64, 64);
    ctx.restore();
    ctx.scale(1, -1);
    ctx.textAlign = 'left';
    ctx.font = '20px KongtextRegular';
    ctx.fillStyle = 'rgb(32,70,49)';
    ctx.fillText('SCORE:', 50, -260, 600);
    ctx.textAlign = 'right';
    ctx.fillText("" + this.score, 280, -260, 600);
    switch (this.state) {
      case 'round over':
        ctx.textAlign = 'center';
        ctx.font = '26px KongtextRegular';
        ctx.fillStyle = 'rgb(32,70,49)';
        ctx.fillText('Mission Complete', 0, -110, 600);
        break;
      case 'round starting':
        secs = 3 - Math.floor(this.stateTick / 35);
        if (secs === 0) {
          secs = 'GO!';
        }
        ctx.textAlign = 'center';
        ctx.font = '70px KongtextRegular';
        ctx.fillStyle = 'rgb(32,70,49)';
        ctx.fillText("" + secs, 0, -110, 600);
        break;
      case 'game over':
        if ((this.stateTick % 30) < 15 || this.stateTick >= 30 * 3) {
          ctx.textAlign = 'center';
          ctx.font = '50px KongtextRegular';
          ctx.fillStyle = 'rgb(32,70,49)';
          ctx.fillText("GAME OVER", 0, -110, 600);
        }
        if (this.stateTick >= 30 * 3) {
          ctx.font = '20px KongtextRegular';
          ctx.fillText('Press space to retry', 0, 100, 600);
        }
    }
    if (!muted) {
      ctx.drawImage(spritesheet, 94 * 2, 99 * 2, 20, 20, 360, 260, 20, 20);
    } else {
      ctx.drawImage(spritesheet, 81 * 2, 99 * 2, 20, 20, 360, 260, 20, 20);
    }
    return ctx.scale(1, -1);
  };

  MainScreen.prototype.drawBackground = function() {
    var b, j, len, ref, results;
    ref = this.background;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      b = ref[j];
      results.push(ctx.drawImage(spritesheet, (80 + 16 * b.tile) * 2, 16 * 2, 32, 32, b.x, b.y, 32, 32));
    }
    return results;
  };

  return MainScreen;

})();

Game = (function(superClass) {
  extend(Game, superClass);

  function Game() {
    Game.__super__.constructor.call(this);
    this.screen = new AttractScreen(this);
  }

  Game.prototype.enter = function(screen) {
    return this.nextScreen = screen;
  };

  Game.prototype.update = function(dt) {
    var base, base1;
    if (this.nextScreen != null) {
      if (typeof (base = this.screen).exit === "function") {
        base.exit();
      }
      this.screen = this.nextScreen;
      this.nextScreen = null;
      if (typeof (base1 = this.screen).enter === "function") {
        base1.enter();
      }
    }
    return this.screen.update(dt);
  };

  Game.prototype.draw = function() {
    return this.screen.draw();
  };

  return Game;

})(atom.Game);

atom.input.bind(atom.key.LEFT_ARROW, 'left');

atom.input.bind(atom.key.RIGHT_ARROW, 'right');

atom.input.bind(atom.key.UP_ARROW, 'up');

atom.input.bind(atom.key.DOWN_ARROW, 'down');

atom.input.bind(atom.key.SPACE, 'shoot');

atom.input.bind(atom.key.S, 'reset');

atom.input.bind(atom.button.LEFT, 'click');

doneLoading = function() {
  var game;
  game = new Game();
  return game.run();
};
