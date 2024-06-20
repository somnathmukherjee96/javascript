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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${formatCurrency(mov, "USD")}</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const formatCurrency = (val, currency) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(val);
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
  labelBalance.textContent = formatCurrency(account.balance, "USD");
};
const calculateAndDisplayIncomes = (account) => {
  account.income = account.movements
    .filter((movement) => movement > 0)
    .reduce((acc, deposits) => acc + deposits, 0);
  labelSumIn.textContent = formatCurrency(account.income, "USD");
};
const calculateAndDisplayOutcomes = (account) => {
  account.outcome = Math.abs(
    account.movements
      .filter((movement) => movement < 0)
      .reduce((acc, deposits) => acc + deposits, 0)
  );
  labelSumOut.textContent = formatCurrency(account.outcome, "USD");
};
const calculateAndDisplayInterest = (account) => {
  account.interest = account.movements
    .filter((movement) => movement > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((acc, deposits) => acc + deposits, 0);
  labelSumInterest.textContent = formatCurrency(account.interest, "USD");
};
const displaySummary = (account) => {
  calculateAndDisplayIncomes(account);
  calculateAndDisplayOutcomes(account);
  calculateAndDisplayInterest(account);
};
const updateUI = (currentAccount) => {
  showCurrentDt();
  //display movements
  displayMovements(currentAccount.movements);
  //display balance
  calculateAndDisplayBalance(currentAccount);
  //display summary
  displaySummary(currentAccount);
};

const showCurrentDt = () => {
  const now = new Date();
  // const day = `${now.getDate()}`.padStart(2, 0);
  // const month = `${now.getMonth() + 1}`.padStart(2, 0);
  // const year = now.getFullYear();
  // const hour = `${now.getHours()}`.padStart(2, 0);
  // const min = `${now.getMinutes()}`.padStart(2, 0);
  // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    year: "numeric",
    month: "numeric",
    weekday: "long",
  };
  labelDate.textContent = new Intl.DateTimeFormat("en-US", options).format(now);
};

let currentAccount;

//logging in
btnLogin.addEventListener("click", function (e) {
  //prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value
  );
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

//issue loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentAccount.movements.some((movement) => movement >= loanAmount * 0.1)
  ) {
    inputLoanAmount.value = "";
    currentAccount.movements.push(loanAmount);
    updateUI(currentAccount);
  }
});

//close account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin = "";
});

//sorting the transactions
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
