const todoformEl = document.querySelector("#todoForm");
const inputEl = document.querySelector("#todo-input");
const submitbtnEl = document.querySelector("#todo-btn");
const todoListEl = document.querySelector("#todoList");
// console.log(todoListEl);

const todoActionsEl = document.querySelector("#todoActions");
const allActionBtnEl = document.querySelector(".btn-all");
const incompleteActionBtnEl = document.querySelector(".btn-incomplete");
const completeActionBtnEl = document.querySelector(".btn-complete");

// Global Variable
const global = {
  apiUrl: "http://localhost:8000/todos",
  editId: null,
  todoList: [],
};

// GET REQUEST
const getRequest = async () => {
  const response = await fetch(`${global.apiUrl}`);
  const data = await response.json();
  return data;
};

// RENDER TODO LIST
const renderTodoList = (todoList) => {
  let markup = "";
  todoList.forEach((item) => {
    console.log(item);
    const timeFormat = new Date(item.createAt).toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });

    markup += `
    <div id="todo" class="todo">
          <div class="todo-status-incomplete" onclick=todoComplete(${item.id})></div>
          <div>
            <h4 class="text-lg font-semibold">${item.title}</h4>
            <p class="text-sm text-gray-400">Created At ${timeFormat}</p>
          </div>

          <div class="flex cursor-pointer">
            <i class="icon-pencil icon icon-green me-2"></i>
            <i class="icon-cross icon icon-red"></i>
          </div>
        </div>
    `;

    todoListEl.innerHTML = markup;
  });
};

// PAGE LOAD
document.addEventListener("DOMContentLoaded", async (e) => {
  try {
    const list = await getRequest();

    if (list.length > 0) {
      renderTodoList(list);
      global.todoList = list;
    } else {
      todoActionsEl.classList.add("hidden");
    }
  } catch (error) {
    alert(error.message);
  }
});
