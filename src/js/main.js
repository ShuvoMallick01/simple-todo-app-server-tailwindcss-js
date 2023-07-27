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
  const response = await fetch(`${global.apiUrl}?_sort=createAt&_order=desc`);
  const data = await response.json();
  return data;
};

// POST REQUEST
const postRequest = async (todo) => {
  const response = await fetch(`${global.apiUrl}`, {
    method: "POST",
    body: JSON.stringify(todo),
    headers: {
      "content-Type": "application/json",
    },
  });

  await response.json();
};

//DELETE REQUEST
const deleteRequest = async (todoId) => {
  if (confirm("You would like to delete this Todo?")) {
    const response = await fetch(`${global.apiUrl}/${todoId}`, {
      method: "DELETE",
    });

    await response.json();
  }
};

// EDIT REQUEST
const editRequest = async (todoId, updateTodo) => {
  const response = await fetch(`${global.apiUrl}/${todoId}`, {
    method: "PUT",
    body: JSON.stringify(updateTodo),
    headers: {
      "content-Type": "application/json",
    },
  });

  await response.json();
};

// EDIT TODO
const titleEdit = (todoId) => {
  global.editId = todoId;
  const todo = global.todoList.find((item) => item.id === todoId);
  submitbtnEl.classList.add("bg-red-400");
  submitbtnEl.innerText = "EDIT";

  inputEl.value = todo.title;
};

// TODO COMPLETE
const todoComplete = (todoId) => {
  const todo = global.todoList.find((item) => item.id === todoId);
  editRequest(todoId, { ...todo, complete: !todo.complete });
  //   console.log((todoId, { ...todo, complete: !todo.complete }));
};

// RENDER TODO LIST
const renderTodoList = (todoList) => {
  let markup = "";
  todoList.forEach((item) => {
    // console.log(item);
    const timeFormat = new Date(item.createAt).toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });

    markup += `
    <div id="todo" class="todo" onclick=todoComplete(${item.id})>
          <div class="todo-status-incomplete" ></div>
          <div>
            <h4 class="text-lg font-semibold">${item.title}</h4>
            <p class="text-sm text-gray-400">Created At ${timeFormat}</p>
          </div>

          <div class="flex cursor-pointer">
            <i id=edit-${item.id} class="icon-pencil icon icon-green me-2"></i>
            <i class="icon-cross icon icon-red" onclick="deleteRequest(${item.id})"></i>
          </div>
        </div>
    `;
  });

  todoListEl.innerHTML = markup;

  todoList.forEach((item) => {
    const editBtn = document.querySelector(`#edit-${item.id}`);

    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      titleEdit(item.id);
    });
  });
};

// CREATE TODO
todoformEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const todoTitle = inputEl.value;

  if (global.editId) {
    const todo = global.todoList.find((item) => item.id === global.editId);
    editRequest(global.editId, { ...todo, title: todoTitle });
  } else {
    const title = todoTitle;
    const complete = false;
    const createAt = new Date().getTime();
    const id = global.todoList.length + 1;

    postRequest({
      title: title,
      complete: complete,
      createAt: createAt,
    });
  }
});

// FILTER FUNCTIONALITY
allActionBtnEl.addEventListener("click", async (e) => {
  // const data = await getRequest();
  renderTodoList(global.todoList);
});

incompleteActionBtnEl.addEventListener("click", async (e) => {
  const response = await fetch(`${global.apiUrl}?complete=false`);
  const data = await response.json();

  renderTodoList(data);
});

completeActionBtnEl.addEventListener("click", async (e) => {
  const response = await fetch(`${global.apiUrl}?complete=true`);
  const data = await response.json();
  renderTodoList(data);
});

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
