//Getting all the required elements
const inputField = document.querySelector(".input-field textarea");
const todoLists = document.querySelector(".todoLists");
const pendingNum = document.querySelector(".pending-num");
const clearButton = document.querySelector(".clear-button");

function updatePendingTaskNumber() {
  let tasks = document.querySelectorAll(".pending");
  pendingNum.textContent = tasks.length > 0 ? tasks.length : "no";
  let allTasks = document.querySelectorAll(".list");
  if (allTasks.length > 0) {
    todoLists.style.marginTop = "20px";
    clearButton.style.pointerEvents = "auto";
  } else {
    todoLists.style.marginTop = "0px";
    clearButton.style.pointerEvents = "none";
  }
}

inputField.addEventListener("keyup", (e) => {
  let inputVal = inputField.value.trim();
  if (e.key === "Enter" && inputVal.length > 0) {
    let liTag = `<li class="list pending" onClick="handleStatus(this)">
          <input type="checkbox" />
          <span class="task">${inputVal}</span>
          <i class="uil uil-trash" onClick="deleteTask(this)"></i>
        </li>`;
    todoLists.insertAdjacentHTML("beforeend", liTag);
    inputField.value = "";
    updatePendingTaskNumber();
  }
});
function handleStatus(e) {
  const checkbox = e.querySelector("input");
  checkbox.checked = checkbox.checked ? false : true;
  e.classList.toggle("pending");
  updatePendingTaskNumber();
}
function deleteTask(e) {
  e.parentElement.remove();
}
clearButton.addEventListener("click", () => {
  todoLists.innerHTML = "";
  updatePendingTaskNumber();
});
