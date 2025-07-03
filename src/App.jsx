import React, { useState, useEffect } from "react";
import { TodoProvider } from "./Contexts/TodoProvider";
import { nanoid } from "nanoid";
import { Toaster, toast } from "react-hot-toast";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 🎉 Confetti on first load
  useEffect(() => {
    const shown = sessionStorage.getItem("confettiShown");
    if (!shown) {
      sessionStorage.setItem("confettiShown", "true");
      confetti({ particleCount: 80, spread: 100, origin: { x: 0.5, y: 0.5 } });
    }
  }, []);

  // 🔃 Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("todos");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setTodos(parsed);
        }
      }
    } catch (error) {
      console.error("Error loading todos:", error);
      localStorage.removeItem("todos");
    }
  }, []);

  // 💾 Save to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo) => {
    const newTodo = { id: nanoid(), ...todo };
    setTodos((prev) => [newTodo, ...prev]);
    toast.success("Todo added ✅");
  };

  const updateTodo = (id, updatedTodo) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updatedTodo } : todo))
    );
    toast.success("Todo updated ✏️");
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    toast("Todo deleted ❌", { icon: "🗑️" });
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    toast("Completion toggled 🎯");
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "completed"
          ? todo.completed
          : !todo.completed;

    const matchesSearch = todo.todo
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const tabOptions = ["all", "completed", "incomplete"];

  return (
    <TodoProvider
      value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete }}
    >
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a1a] text-white px-4 py-12 font-inter">
        <Toaster position="top-right" />
        <div className="w-full max-w-md p-6 rounded-3xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.08)] space-y-6 transition-all duration-500">
          <h1 className="text-3xl font-bold text-amber-300 text-center drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
            📝 Modern Todo App
          </h1>

          <TodoForm />

          {/* 🔍 Search Input */}
          <input
            type="text"
            placeholder="Search todos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 outline-none focus:ring-2 ring-amber-300/50 transition"
          />

          {/* 🎛️ Animated Filter Tabs */}
          <div className="relative flex justify-center bg-white/5 p-1 rounded-full gap-1">
            {tabOptions.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className="relative z-10 px-4 py-1.5 rounded-full text-sm"
              >
                <span
                  className={`capitalize ${filter === tab ? "text-amber-300" : "text-white/60"
                    }`}
                >
                  {tab}
                </span>
                {filter === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 rounded-full ${tab === "completed"
                      ? "bg-green-300/20 shadow-[0_0_8px_#4ade80]"
                      : tab === "incomplete"
                        ? "bg-red-300/20 shadow-[0_0_8px_#f87171]"
                        : "bg-yellow-300/20 shadow-[0_0_8px_#facc15]"
                      }`}

                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* 🧾 Todo List */}
          <div className="space-y-3">
            {filteredTodos.length === 0 ? (
              <p className="text-center text-white/50">
                No matching todos found.
              </p>
            ) : (
              filteredTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))
            )}
          </div>
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;
