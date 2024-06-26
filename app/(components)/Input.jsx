"use client";
import {
  motion,
  useAnimate,
  useAnimationControls,
  useDragControls,
  useMotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const Input = ({ open, setOpen, editId }) => {
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);
  const controls = useDragControls();
  const [scope, animate] = useAnimate();
  const y = useMotionValue(0);

  const [data, setData] = useState({
    title: "",
    body: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data if editing
  useEffect(() => {
    if (editId) {
      console.log("yes");
      fetch(`/api/notes/${editId}`)
        .then((res) => res.json())
        .then((data) => setData(data));
      console.log(data);
      setData({
        title: data.title,
        body: data.body,
        category: data.category,
      });
    }
  }, [open]);

  function handleClose() {
    let yStart = typeof y.get() === "number" ? y.get() : 0;
    animate("#drawer", {
      y: [yStart, 600],
    });
    setOpen((prev) => !prev);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (editId) {
      try {
        const res = await fetch(`/api/notes/${editId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        console.log(pathname);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || "There is a problem with the request"
          );
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
        handleClose();
        router.refresh();
      }
      return;
    }

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "There is a problem with the request"
        );
      }

      setData({
        title: "",
        body: "",
        category: "",
      });
      setOpen(false);
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (open) {
    return (
      <div
        ref={scope}
        onClick={() => handleClose()}
        className="h-[100vh] z-10 fixed select-none w-full max-w-[1200px] overflow-hidden"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          id="drawer"
          initial={{
            y: 100,
          }}
          animate={{
            y: 0,
          }}
          dragListener={false}
          style={{ y }}
          onDragEnd={() => {
            if (y.get() > 100) {
              handleClose();
            }
          }}
          dragControls={controls}
          drag="y"
          dragConstraints={{
            top: 0,
            bottom: 0,
          }}
          transition={{
            ease: "easeInOut",
          }}
          dragElastic={{
            top: 0,
            bottom: 0.5,
          }}
          className="fixed bg-white text-black mx-auto bottom-0 w-full z-10 rounded-t-xl overflow-hidden h-[90vh] shadow-lg"
        >
          <div
            onPointerDown={(e) => controls.start(e)}
            className="header cursor-pointer active:cursor-grabbing touch-none fixed grid place-items-center h-6 rounded-t-xl w-full mx-auto bg-black"
          >
            <div className="bg-white w-6 h-2 rounded-md"></div>
          </div>

          <form className="mt-6 w-[90%] mx-auto" onSubmit={handleSubmit}>
            <h3 className="text-xl font-semibold mb-4">
              {editId ? "Edit your note" : "Create a new note"}
            </h3>
            <label className="block text-sm mb-2">Title</label>
            <input
              className="w-full bg-gray-200 rounded-lg outline-none p-2 mb-4"
              type="text"
              value={data.title}
              onChange={handleChange}
              name="title"
            />
            <label className="block text-sm mb-2">Text</label>
            <textarea
              className="w-full bg-gray-200 rounded-lg outline-none p-2 mb-4 h-[280px]"
              cols="50"
              type="text"
              value={data.body}
              onChange={handleChange}
              name="body"
            />
            <label className="block text-sm mb-2">Category</label>
            <select
              className="w-full max-w-[100%] form-select overflow-x-hidden bg-gray-200 rounded-lg outline-none p-2 mb-4"
              value={data.category}
              onChange={handleChange}
              name="category"
            >
              <option className="text-sm" value="" disabled>
                Select category
              </option>
              <option className="text-sm" value="miscellaneous">
                Miscellaneous
              </option>
              <option className="text-sm" value="work">
                Work
              </option>
              <option className="text-sm" value="personal">
                Personal
              </option>
            </select>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <button
              type="submit"
              className="w-full p-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition duration-200 mt-4"
              disabled={loading}
            >
              {loading ? "Submitting..." : editId ? "Edit" : "Submit"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }
  return null;
};

export default Input;
