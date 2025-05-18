
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC9w8wxexwByKZIJ8LJpEE9RFV8IwukUG4",
  authDomain: "marbella-control.firebaseapp.com",
  databaseURL: "https://marbella-control-default-rtdb.firebaseio.com",
  projectId: "marbella-control",
  storageBucket: "marbella-control.appspot.com",
  messagingSenderId: "836771473986",
  appId: "1:836771473986:web:817bf0fe4085a42a449bdb",
  measurementId: "G-XQD5RFS5M2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const statuses = ["pendiente", "en-proceso", "terminada"];

function renderTasks(snapshot) {
  statuses.forEach(status => {
    document.querySelector(`#${status} .task-list`).innerHTML = "";
  });

  const data = snapshot.val();
  for (let key in data) {
    const task = data[key];
    const div = document.createElement("div");
    div.className = "task";
    div.innerHTML = `
      <strong>${task.name}</strong><br>
      Asignado a: ${task.assigned}<br>
      Estado: ${task.status}<br>
      <button onclick="moveTask('${key}', '${task.status}')">Cambiar estado</button>
    `;
    document.querySelector(`#${task.status} .task-list`).appendChild(div);
  }
}

onValue(ref(db, "tasks"), renderTasks);

window.addTask = () => {
  const name = document.getElementById("task-name").value;
  const assigned = document.getElementById("assigned-to").value;
  const status = document.getElementById("task-status").value;
  push(ref(db, "tasks"), { name, assigned, status });
};

window.moveTask = (id, currentStatus) => {
  const index = statuses.indexOf(currentStatus);
  const newStatus = statuses[(index + 1) % statuses.length];
  update(ref(db, "tasks/" + id), { status: newStatus });
};
