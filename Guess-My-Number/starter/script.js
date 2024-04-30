'use strict';

// console.log(document.querySelector('.message').textContent);
// document.querySelector('.message').textContent = 'correct number';

// document.querySelector('.number').textContent = 13;
// document.querySelector('.guess').value = 23;
let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
const message = document.querySelector('.message').textContent;
const number = document.querySelector('.number').textContent;
const input = document.querySelector('.guess').value;
let highScore = 0;
const displayMessage = message =>
  (document.querySelector('.message').textContent = message);

document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);
  console.log(guess);
  //when there's no input
  if (!guess) {
    displayMessage('No number');
  }
  //when the guess is correct
  else if (guess === secretNumber) {
    displayMessage('correct number');
    document.querySelector('.number').textContent = secretNumber;
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';
    if (highScore < score) {
      highScore = score;
      document.querySelector('.highscore').textContent = highScore;
    }
  }
  //when guess is wrong
  else if (guess !== secretNumber) {
    if (score > 1) {
      displayMessage(guess > secretNumber ? 'Too high' : 'Too low');
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      document.querySelector('.score').textContent = 0;
      displayMessage('You lost the game!');
    }
  }
});
//   //when the guess is higher than the number
//   else if (guess > secretNumber) {
//     document.querySelector('.number').textContent = secretNumber;
//     if (score > 1) {
//       document.querySelector('.message').textContent = 'Too high';
//       score--;
//       document.querySelector('.score').textContent = score;
//     } else {
//       document.querySelector('.score').textContent = 0;
//       document.querySelector('.message').textContent = 'You lost the game!';
//     }
//   }
//   //when the guess is lower than the number
//   else if (guess < secretNumber) {
//     document.querySelector('.number').textContent = secretNumber;
//     if (score > 1) {
//       document.querySelector('.message').textContent = 'Too low';
//       score--;
//       document.querySelector('.score').textContent = score;
//     } else {
//       document.querySelector('.score').textContent = 0;
//       document.querySelector('.message').textContent = 'You lost the game!';
//     }
//   }
// });

document.querySelector('.again').addEventListener('click', function () {
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  document.querySelector('.guess').value = input;
  displayMessage(message);
  score = 20;
  document.querySelector('.score').textContent = score;
  document.querySelector('.number').textContent = number;
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
  document.querySelector('.highscore').textContent = highScore;
});
