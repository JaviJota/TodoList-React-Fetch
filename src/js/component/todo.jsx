import React, { useState } from "react";

const List = () => {
  const [taskInput, setTaskInputValue] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [todos, setTodos] = useState([]);

  const handleGetTaskInput = (e) => {
    setTaskInputValue(e.target.value);
    console.log("Tarea recogida:", taskInput);
  };

  const handleCurrentUser = (e) => {
    setCurrentUser(e.target.value);
    console.log("Usuario recogido:", currentUser);
  };

  // CREAR USUARIO EN API
  const createUser = async () => {
    try {
      const resp = await fetch(
        "https://playground.4geeks.com/todo/users/" + currentUser,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(),
        }
      );
      if (!resp.ok) throw new Error("Error registering new user");
      const data = await resp.json();
      console.log(data);
    } catch (error) {
      console.log("Error registering new user ----->" + error);
      alert("Error registering new user");
    }
  };

  //RECOGER TAREAS DE LA API
  const getUserTasks = async () => {
    try {
      const resp = await fetch(
        "https://playground.4geeks.com/todo/users/" + currentUser
      );
      if (!resp.ok) throw new Error("User doesn't exist");
      const data = await resp.json();
      setTodos(data.todos);
    } catch (error) {
      alert("User doesn't exist");
      console.log("User doesn't exist ----->" + error);
    }
  };

  //AÑADIR TAREA A API
  const addNewTask = async () => {
    try {
      const resp = await fetch(
        "https://playground.4geeks.com/todo/todos/" + currentUser,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            label: taskInput,
            is_done: false,
          }),
        }
      );
      if (!resp.ok) throw new Error("Error adding new task");
      const data = await resp.json();
      console.log(data);
      getUserTasks();
      setTaskInputValue("");
    } catch (error) {
      alert("Error adding new task");
      console.log("Error adding new task ----->" + error);
    }
  };

  //AÑADIR TAREA AL PRESIONAR ENTER
  const submitTask = (e) => {
    if (e.key === "Enter" && taskInput.length > 0) {
      addNewTask(currentUser);
    }
  };

  //ELIMINAR TAREA DE API
  const deleteTask = async (id) => {
    try {
      const resp = await fetch(
        "https://playground.4geeks.com/todo/todos/" + id,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
          },
        }
      );
      if (!resp.ok) throw new Error("Error deleting task");
      getUserTasks();
    } catch (error) {
      alert("Error deleting task");
      console.log("Error deleting task ----->" + error);
    }
  };

  const deleteAllTasks = async () => {
    await deleteUser();
    await createUser();
    getUserTasks();
  };

  // ELIMINAR USUARIO DE API
  const deleteUser = async () => {
    try {
      const resp = await fetch(
        "https://playground.4geeks.com/todo/users/" + currentUser,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
          },
          body: JSON.stringify(),
        }
      );
      if (!resp.ok) throw new Error("Error deleting user");
      setCurrentUser("");
      setTodos([]);
    } catch (error) {
      alert("Error deleting user");
      console.log("Error deleting user ----->" + error);
    }
  };

  // IMPRIMIR LISTA DE TAREAS EN PANTALLA

  return (
    <>
      <div>
        <input
          className="rounded-2 me-2 "
          type="text"
          placeholder="Enter user name..."
          onChange={handleCurrentUser}
          value={currentUser}
        />
        <button className="btn btn-primary me-2" onClick={createUser}>
          Create User
        </button>
        <button className="btn btn-success me-2" onClick={getUserTasks}>
          Log in
        </button>
        <button className="btn btn-danger" onClick={deleteUser}>
          Delete User
        </button>
      </div>
      <div>
        <input
          className="w-50 rounded-2 me-2 mt-3 "
          type="text"
          placeholder="Add new task...     (Press Enter to submit)"
          onChange={handleGetTaskInput}
          onKeyUp={submitTask}
          value={taskInput}
        />
      </div>
      <div>
        <ul className="list-group mt-3">
          {todos &&
            todos.map((todo, index) => (
              <li className="list-group-item" key={index} id={todo.id}>
                {todo.label}{" "}
                <button
                  className="btn btn-danger"
                  onClick={() => deleteTask(todo.id)}
                >
                  Delete task
                </button>
              </li>
            ))}
        </ul>
      </div>
      {/* Mostrar botón para eliminar todas las tareas SOLO si existe alguna tarea*/}
      {todos && todos.length > 0 ? (
        <button className="btn btn-danger mt-5" onClick={deleteAllTasks}>
          Delete all tasks
        </button>
      ) : (
        ""
      )}
    </>
  );
};

export default List;
