"use client";

import {
  motion,
  useAnimate,
  useDragControls,
  useMotionValue,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Modal = ({ open, setOpen, id }) => {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const [scope, animate] = useAnimate();
  const y = useMotionValue(0);
  const controls = useDragControls();
  const handleDelete = (id) => {
    setDeleting(true);
    fetch(`/api/notes/${id}`, {
      method: "DELETE",
    }).then(() => {
      setDeleting(false);
      handleClose();
      router.push("/");
    });
  };
  const handleClose = () => {
    let yStart = typeof y.get() === "number" ? y.get() : 0;
    animate(scope.current, {
      y: [yStart, 300],
    });
    setOpen(false);
  };
  if (open) {
    return (
      <div onClick={() => handleClose()} className="parent fixed inset-0">
        {deleting && <div>deleting...</div>}
        <motion.div
          ref={scope}
          initial={{
            y: 100,
          }}
          onClick={(e) => e.stopPropagation()}
          animate={{
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          drag="y"
          style={{ y }}
          dragListener={false}
          dragControls={controls}
          dragConstraints={{
            top: 0,
            bottom: 0,
          }}
          onDragEnd={() => {
            if (y.get() > 40) {
              handleClose();
            }
          }}
          dragElastic={{
            top: 0,
            bottom: 0.5,
          }}
          className="wrapper fixed bottom-0 h-[30vh] bg-black text-white w-full rounded-t-xl"
        >
          <div className="sheet">
            <div
              onPointerDown={(e) => controls.start(e)}
              className="header w-full  grid place-items-center rounded-t-xl h-3"
            >
              <div className="drawer cursor-pointer rounded-xl active:cursor-grabbing h-1 w-6 bg-white touch-none fixed"></div>
            </div>
            <div className="query mt-7 w-[90%] mx-auto">
              <h3 className="font-bold w-[90%] text-center text-xl mx-auto  text-white-400">
                Are you sure you want to delete?
              </h3>
              <div
                onClick={() => {
                  handleDelete(id);
                }}
                className="yes w-[90%] mx-auto max-w-[400px] border border-white border-solid rounded-xl text-center mt-3 p-2"
              >
                Yes
              </div>
              <div
                onClick={() => handleClose()}
                className="no w-[90%] border bg-white text-black max-w-[400px] mx-auto border-white border-solid rounded-xl text-center mt-3 p-2"
              >
                No
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
};
export default Modal;
