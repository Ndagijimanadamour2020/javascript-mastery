import { STORAGE_KEYS } from "../shared/constants.js";
import { saveData, getData, generateID } from "../shared/utils.js";

const list = document.getElementById("todoList");
const modal = document.getElementById("editModal");
const editTitle = document.getElementById("editTitle");
const editPriority = document.getElementById("editPriority");

let todos = getData(STORAGE_KEYS.TODOS);
let editId = null;

function render() {
  list.innerHTML = "";
  todos.forEach(todo => {
    const li = document.createElement("li");
    li.draggable = true;
    li.dataset.id = todo.id;
    li.innerHTML = `
      <span>${todo.title}</span>
      <div>
        <button onclick="editTask(${todo.id})">✏</button>
        <button onclick="deleteTask(${todo.id})">❌</button>
      </div>
    `;
    list.appendChild(li);
  });
  saveData(STORAGE_KEYS.TODOS, todos);
}

window.editTask = id => {
  const t = todos.find(t => t.id === id);
  editId = id;
  editTitle.value = t.title;
  editPriority.value = t.priority;
  modal.hidden = false;
};

window.closeModal = () => modal.hidden = true;

document.getElementById("saveEdit").onclick = () => {
  const t = todos.find(t => t.id === editId);
  t.title = editTitle.value;
  t.priority = editPriority.value;
  modal.hidden = true;
  render();
};

window.deleteTask = id => {
  todos = todos.filter(t => t.id !== id);
  render();
};

/* DRAG & DROP */
let dragged;
list.addEventListener("dragstart", e => dragged = e.target);
list.addEventListener("dragover", e => e.preventDefault());
list.addEventListener("drop", e => {
  e.preventDefault();
  list.insertBefore(dragged, e.target.closest("li"));
});

render();
