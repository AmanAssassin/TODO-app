import React, { useState } from "react";
import { useTodo } from "../Contexts/TodoProvider";

function TodoForm() {
  const [todo, setTodo] = useState("");
  const { addTodo } = useTodo();

  const add = (e) => {
    e.preventDefault();
    if (!todo) return;
    addTodo({ todo, completed: false });
    setTodo("");
  };

  return (
    <form
      onSubmit={add}
      className="flex flex-col sm:flex-row items-stretch gap-3 shadow-[0_0_20px_rgba(255,255,255,0.08)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition duration-300 rounded-xl"
    >
      <input
        type="text"
        placeholder="Write Todo..."
        className="w-full px-4 py-2 rounded-xl text-white bg-white/10 backdrop-blur-md placeholder-white/50 outline-none border border-white/20 focus:border-amber-300 focus:ring-2 focus:ring-amber-300 transition duration-300"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
      <button
        type="submit"
        className="px-5 py-2 rounded-xl text-white font-semibold bg-green-500/70 hover:bg-green-500 hover:shadow-[0_0_10px_rgba(34,197,94,0.6)] backdrop-blur-md border border-white/20 transition duration-300"
      >
        Add
      </button>
    </form>
  );
}

export default TodoForm;
