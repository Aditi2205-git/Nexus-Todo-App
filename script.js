const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");
const progressPercent = document.getElementById("progressPercent");

const filters = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("nexusTasks")) || [];

let currentFilter = "all";


function saveTasks() {

    localStorage.setItem(
        "nexusTasks",
        JSON.stringify(tasks)
    );
}


function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        taskInput.focus();
        return;
    }

    const task = {

        id: Date.now(),

        text: text,

        completed: false

    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";

    renderTasks();
}


function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });

    saveTasks();

    renderTasks();
}


function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks();

    renderTasks();
}


function getFilteredTasks() {

    if (currentFilter === "active") {

        return tasks.filter(
            task => !task.completed
        );

    }

    if (currentFilter === "completed") {

        return tasks.filter(
            task => task.completed
        );

    }

    return tasks;
}


function renderTasks() {

    taskList.innerHTML = "";

    const filteredTasks = getFilteredTasks();

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }


        const checkbox = document.createElement("div");

        checkbox.className = "task-checkbox";

        checkbox.addEventListener(
            "click",
            () => toggleTask(task.id)
        );


        const text = document.createElement("span");

        text.className = "task-text";

        text.textContent = task.text;


        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";

        deleteButton.textContent = "×";

        deleteButton.title = "Delete task";

        deleteButton.addEventListener(
            "click",
            () => deleteTask(task.id)
        );


        li.appendChild(checkbox);

        li.appendChild(text);

        li.appendChild(deleteButton);

        taskList.appendChild(li);

    });


    emptyState.style.display =
        filteredTasks.length === 0
            ? "block"
            : "none";


    updateStats();
}


function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const active = total - completed;

    const progress =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);


    totalTasks.textContent = total;

    activeTasks.textContent = active;

    completedTasks.textContent = completed;

    progressPercent.textContent =
        `${progress}%`;
}


addTaskBtn.addEventListener(
    "click",
    addTask
);


taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


filters.forEach(filter => {

    filter.addEventListener(
        "click",
        () => {

            filters.forEach(
                button =>
                    button.classList.remove("active")
            );

            filter.classList.add("active");

            currentFilter =
                filter.dataset.filter;

            renderTasks();

        }
    );

});


renderTasks();
