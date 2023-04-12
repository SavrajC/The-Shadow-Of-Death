const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
let playerHitX = [];
ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.jpg",
});

const playerOne = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/King/Sprites/Idle.png",
  framesMax: 8,
  scale: 2.7,
  offset: {
    x: 100,
    y: 50,
  },
  sprites: {
    idle: {
      imageSrc: "./img/King/Sprites/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/King/Sprites/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/King/Sprites/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/King/Sprites/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/King/Sprites/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/King/Sprites/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/King/Sprites/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 90,
      y: 50,
    },
    width: 230,
    height: 50,
  },
});

const playerTwo = new Fighter({
  position: {
    x: 900,
    y: -100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  imageSrc: "./img/Fantasy Warrior/Sprites/Idle.png",
  framesMax: 10,
  scale: 2.8,
  offset: {
    x: 215,
    y: 50,
  },
  sprites: {
    idle: {
      imageSrc: "./img/Fantasy Warrior/Sprites/Idle1.png",
      framesMax: 10,
    },
    run: {
      imageSrc: "./img/Fantasy Warrior/Sprites/Run1.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/Fantasy Warrior/Sprites/Jump1.png",
      framesMax: 3,
    },
    fall: {
      imageSrc: "./img/Fantasy Warrior/Sprites/Fall2.png",
      framesMax: 3,
    },
    attack1: {
      imageSrc: "./img/Fantasy Warrior/Sprites/Attack1.png",
      framesMax: 7,
    },
    takeHit: {
      imageSrc: "./img/Fantasy Warrior/Sprites/Take hit1.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/Fantasy Warrior/Sprites/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -230,
      y: 50,
    },
    width: 230,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  //shop.update()
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  playerOne.update();
  playerTwo.update();

  playerOne.velocity.x = 0;
  playerTwo.velocity.x = 0;

  // playerOne movement

  if (keys.a.pressed && playerOne.lastKey === "a") {
    playerOne.velocity.x = -5;
    playerOne.switchSprite("run");
  } else if (keys.d.pressed && playerOne.lastKey === "d") {
    playerOne.velocity.x = 5;
    playerOne.switchSprite("run");
  } else {
    playerOne.switchSprite("idle");
  }

  // jumping
  if (playerOne.velocity.y < 0) {
    playerOne.switchSprite("jump");
  } else if (playerOne.velocity.y > 0) {
    playerOne.switchSprite("fall");
  }

  // playerTwo movement
  if (keys.ArrowLeft.pressed && playerTwo.lastKey === "ArrowLeft") {
    playerTwo.velocity.x = -5;
    playerTwo.switchSprite("run");
  } else if (keys.ArrowRight.pressed && playerTwo.lastKey === "ArrowRight") {
    playerTwo.velocity.x = 5;
    playerTwo.switchSprite("run");
  } else {
    playerTwo.switchSprite("idle");
  }

  // jumping
  if (playerTwo.velocity.y < 0) {
    playerTwo.switchSprite("jump");
  } else if (playerTwo.velocity.y > 0) {
    playerTwo.switchSprite("fall");
  }

  // detect for collision & playerTwo gets hit
  if (
    collisionDetection({
      rectangle1: playerOne,
      rectangle2: playerTwo,
    }) &&
    playerOne.isAttacking &&
    playerOne.framesCurrent === 2
  ) {
    playerTwo.takeHit(20);
    playerHitX.push(playerOne.position.x);
    playerOne.isAttacking = false;

    localStorage.setItem("playerHitX", JSON.stringify(playerHitX));
    gsap.to("#playerTwoHealth", {
      width: playerTwo.health + "%",
    });
  }

  // if playerOne misses
  if (playerOne.isAttacking && playerOne.framesCurrent === 4) {
    playerOne.isAttacking = false;
  }

  // this is where our playerOne gets hit
  if (
    collisionDetection({
      rectangle1: playerTwo,
      rectangle2: playerOne,
    }) &&
    playerTwo.isAttacking &&
    playerTwo.framesCurrent === 2
  ) {
    playerOne.takeHit(25);
    playerHitX.push(playerTwo.position.x);
    localStorage.setItem("playerHitX", JSON.stringify(playerHitX));
    playerTwo.isAttacking = false;

    gsap.to("#playerOneHealth", {
      width: playerOne.health + "%",
    });
  }

  // if playerOne misses
  if (playerTwo.isAttacking && playerTwo.framesCurrent === 2) {
    playerTwo.isAttacking = false;
  }

  // end game based on health
  if (playerTwo.health <= 0 || playerOne.health <= 0) {
    determineWinner({ playerOne, playerTwo, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!playerOne.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        playerOne.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        playerOne.lastKey = "a";
        break;
      case "w":
        playerOne.velocity.y = -20;
        break;
      case "s":
        playerOne.attack();
        break;
    }
  }

  if (!playerTwo.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        playerTwo.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        playerTwo.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        playerTwo.velocity.y = -20;
        break;
      case "ArrowDown":
        playerTwo.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  // playerTwo keys
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
