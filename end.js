const winner = localStorage.getItem("winner");
const playerHitX = JSON.parse(localStorage.getItem("playerHitX"));
console.log(playerHitX);
if (winner == "tie") {
  document.querySelector("#winner").innerHTML = "It's a Tie!";
} else {
  document.querySelector("#winner").innerHTML = "The winner is: " + winner;
}
let rangeCounts = [0, 0, 0, 0]; // initialize counts for each range
const hitCount = playerHitX.length;
// count the values in each range
playerHitX.forEach((value) => {
  if (value < 325) {
    rangeCounts[0]++;
  } else if (value < 650) {
    rangeCounts[1]++;
  } else if (value < 957) {
    rangeCounts[2]++;
  } else {
    rangeCounts[3]++;
  }
});

// find the range with the highest count
let highestCount = 0;
let highestRange = 0;

rangeCounts.forEach((count, index) => {
  if (count > highestCount) {
    highestCount = count;
    highestRange = index;
  }
});

if (highestRange == 0) {
  document.querySelector("#playerHitX").innerHTML =
    "You fought most on the left side of the stage";
} else if (highestRange == 1) {
  document.querySelector("#playerHitX").innerHTML =
    "You fought most in the middle of the stage";
} else if (highestRange == 2) {
  document.querySelector("#playerHitX").innerHTML =
    "You fought most on the right side of the stage";
}
document.querySelector("#hitCount").innerHTML =
  "You hit eachother " + hitCount + " times.";

localStorage.removeItem("playerHitX");
localStorage.removeItem("winner");
