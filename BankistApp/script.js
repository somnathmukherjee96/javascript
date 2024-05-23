"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements) {
  containerMovements.innerHTML = "";
  movements.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
const createUsernames = (accounts) => {
  accounts.forEach(
    (account) =>
      (account.username = account.owner
        .toLocaleLowerCase()
        .split(" ")
        .map((name) => name[0])
        .join(""))
  );
};
createUsernames(accounts);

const createWithdrawals = (accounts) => {
  accounts.forEach(
    (account) =>
      (account.withdrawals = account.movements.filter(
        (movement) => movement < 0
      ))
  );
};

createWithdrawals(accounts);

const calculateAndDisplayBalance = (account) => {
  account.balance = account.movements.reduce(
    (acc, movement) => acc + movement,
    0
  );
  labelBalance.textContent = `${currentAccount.balance}€`;
};
const calculateAndDisplayIncomes = (account) => {
  account.income = account.movements
    .filter((movement) => movement > 0)
    .reduce((acc, deposits) => acc + deposits, 0);
  labelSumIn.textContent = `${account.income}€`;
};
const calculateAndDisplayOutcomes = (account) => {
  account.outcome = Math.abs(
    account.movements
      .filter((movement) => movement < 0)
      .reduce((acc, deposits) => acc + deposits, 0)
  );
  labelSumOut.textContent = `${account.outcome}€`;
};
const calculateAndDisplayInterest = (account) => {
  account.interest = account.movements
    .filter((movement) => movement > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((acc, deposits) => acc + deposits, 0);
  labelSumInterest.textContent = `${account.interest}€`;
};
const displaySummary = (account) => {
  calculateAndDisplayIncomes(account);
  calculateAndDisplayOutcomes(account);
  calculateAndDisplayInterest(account);
};
const updateUI = (currentAccount) => {
  //display movements
  displayMovements(currentAccount.movements);
  //display balance
  calculateAndDisplayBalance(currentAccount);
  //display summary
  displaySummary(currentAccount);
};

let currentAccount;

//logging in
btnLogin.addEventListener("click", function (e) {
  //prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    //clear the input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

//transfers
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Transfer button was clicked");
  const transferAmount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    (account) => account.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    transferAmount > 0 &&
    receiverAccount &&
    transferAmount <= currentAccount.balance &&
    receiverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-transferAmount);
    receiverAccount.movements.push(transferAmount);
    updateUI(currentAccount);
  }
});
