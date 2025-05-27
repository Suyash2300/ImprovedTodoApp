import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css"

const App = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos"));
    const savedMode = JSON.parse(localStorage.getItem("darkMode"));
    if (storedTodos) setTodos(storedTodos);
    if (savedMode !== null) setDarkMode(savedMode);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [todos, darkMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (editId) {
      setTodos(
        todos.map((todo) => (todo.id === editId ? { ...todo, text } : todo))
      );
      setEditId(null);
    } else {
      const newTodo = { id: Date.now(), text, completed: false };
      setTodos([newTodo, ...todos]);
    }
    setText("");
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEdit = (id, currentText) => {
    setEditId(id);
    setText(currentText);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -20 },
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } min-h-screen p-4 sm:p-6`}
    >
      <div className="max-w-xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">React Todo</h1>
          <button
            onClick={toggleDarkMode}
            className="border px-3 py-1 rounded text-sm"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 mb-4"
        >
          <input
            type="text"
            className="border px-3 py-2 rounded text-black flex-1"
            placeholder="Add or edit task"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            {editId ? "Update" : "Add"}
          </button>
        </form>

        <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-4">
          {["all", "active", "completed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded text-sm ${
                filter === type ? "bg-blue-500 text-white" : "border"
              }`}
            >
              {type[0].toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <ul className="space-y-2">
          <AnimatePresence>
            {filteredTodos.map((todo) => (
           <motion.li
  key={todo.id}
  initial="hidden"
  animate="visible"
  exit="exit"
  variants={variants}
  transition={{ duration: 0.2 }}
  className={`flex justify-between items-center p-3 rounded shadow ${
    darkMode ? "bg-gray-800" : "bg-white"
  }`}
>
  <div 
    onClick={() => toggleComplete(todo.id)}
    className={`cursor-pointer flex-1 text-sm sm:text-base ${
      todo.completed ? "line-through text-gray-400" : ""
    }`}
  >
    {todo.text}
    <div className="text-xs text-gray-500 mt-1">
      {new Date(todo.createdAt).toLocaleString()}
    </div>
  </div>
  <div className="flex gap-2 ml-3 text-sm">
    <button
      onClick={() => startEdit(todo.id, todo.text)}
      className="text-green-500 hover:underline"
    >
      Edit
    </button>
    <button
      onClick={() => deleteTodo(todo.id)}
      className="text-red-500 hover:underline"
    >
      Delete
    </button>
  </div>
</motion.li>

            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
};

export default App



