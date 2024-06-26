"use client";
import { Comment } from "react-loader-spinner";
import { MdDelete } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { FaArrowLeftLong } from "react-icons/fa6";
import Modal from "@/app/(components)/Modal";
import { useEffect, useState } from "react";
import Input from "@/app/(components)/Input";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const Page = ({ params }) => {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const [openInput, setOpenInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { id } = params;
  console.log(id);
  useEffect(() => {
    setLoading(true);
    fetch(`/api/notes/${id}`, { cache: "no-store" })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        setNote(data);
        console.log("data fetched");
      })
      .catch((error) => {
        setError(true);
        console.log(error);
      });
  }, [openInput]);

  useEffect(() => {
    router.refresh();
    console.log("route change!");
  }, [openInput]);

  if (note) {
    return (
      <main className="">
        <Modal id={id} open={open} setOpen={setOpen}></Modal>
        <Input open={openInput} setOpen={setOpenInput} editId={id} />
        <div className="wrapper w-[90%] max-w-[1200px] mx-auto mt-5">
          <div className="header flex justify-between">
            <div onClick={() => router.push("/")} className="arrowabck">
              <FaArrowLeftLong size={25} />
            </div>
            <div className="star-edit flex justify-between gap-2">
              <div onClick={() => setOpenInput(true)} className="edit">
                <CiEdit size={25} />
              </div>
              <div className="star">
                <FaStar size={25} />
              </div>
              <div onClick={() => setOpen(true)} className="delete">
                <MdDelete size={25} />
              </div>
            </div>
          </div>
          <div className="title font-extrabold text-3xl mt-4">{note.title}</div>
          <span className="date font-bold mb-6">Mar 19, 2023 at 6:46pm</span>
          <div className="text mt-6">{note.body}</div>
        </div>
      </main>
    );
  } else if (error) {
    return (
      <div className="grid place-items-center h-[100vh] w-full">
        Cannot fetch notes
      </div>
    );
  } else if (loading) {
    return (
      <div className="grid place-items-center h-[100vh] w-full">
        <Comment />
      </div>
    );
  }
};
export default Page;
