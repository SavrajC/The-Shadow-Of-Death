function determineWinner({ playerOne, playerTwo, timerId }) {
  let winner;
  clearTimeout(timerId);
  document.querySelector("#displayText").style.display = "flex";
  if (playerOne.health === playerTwo.health) {
    document.querySelector("#displayText").innerHTML = "Tie";
    winner = "tie";
  } else if (playerOne.health > playerTwo.health) {
    document.querySelector("#displayText").innerHTML = "William Wins";
    winner = "William";
  } else if (playerOne.health < playerTwo.health) {
    document.querySelector("#displayText").innerHTML = "Arthur Wins";
    winner = "Arthur";
  }

  localStorage.setItem("winner", winner);

  setTimeout(() => {
    window.location.href = "end-screen.html";
  }, 3000); 
}

let timer = 120;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({ player, playerTwo, timerId });
  }
}

function collisionDetection({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}
