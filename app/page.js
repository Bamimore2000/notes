"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Card from "./(components)/Card";
import CategoryTag from "./(components)/CategoryTag";
import { IoMdNotificationsOutline } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { AiOutlinePlus } from "react-icons/ai";
import { IoPerson } from "react-icons/io5";
import Input from "./(components)/Input";
import { set } from "mongoose";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [current, setCurrent] = useState("all");
  const [render, setRender] = useState([]);
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState("");
  const [categoryTag, setCategoryTag] = useState([]);

  const handleColor = (tag, category) => {
    setTag(tag);
    setCurrent(category);
  };

  useEffect(() => {
    try {
      fetch("/api/notes", { cache: "no-store" })
        .then((response) => {
          console.log("data recieved", response);
          return response.json();
        })
        .then((data) => {
          console.log("data converted", data);
          setCategoryTag(() => {
            let result = data.data.filter(({ category }) => category);
            return [...new Set(result.map((item) => item.category))];
          });
        });
      console.log(categoryTag);
    } catch (error) {
      setError(true);
      setLoading(false);
      console.log("there is an error");
    }
  }, []);

  console.log(categoryTag);
  useEffect(() => {
    console.log("mounted");
    // fetch all the data
    if (current === "all") {
      setLoading(true);
      try {
        fetch("/api/notes", { cache: "no-store" })
          .then((response) => {
            console.log("data recieved", response);
            return response.json();
          })
          .then((data) => {
            console.log("data converted", data);
            setRender(data.data);
            console.log(render);
          });
        console.log(render);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.log("there is an error");
      }
      // fetch all
      // setRender
    } else {
      try {
        fetch(`/api/notes?query=${current}`)
          .then((res) => res.json())
          .then((data) => setRender(data.data));
      } catch (error) {}
      // setRender
    }
  }, [current, open]);

  const newSet = [...new Set(render?.map(({ category }) => category))];
  console.log(newSet);

  return (
    <main className=" relative  mt-4 max-w-[] bg-white text-black  mx-auto h-[100vh] overflow-x-hidden overflow-y-visible">
      <Input open={open} setOpen={setOpen} />
      <nav className="w-[90%]  mx-auto flex justify-between items-center">
        <div className="image-name flex items-center gap-2">
          <div className="image">
            {" "}
            <IoPerson size={25} />
          </div>
          <p>
            Welcome back <span className="font-semibold">Sogo</span>
          </p>
        </div>
        <div className="search-notis flex gap-2 items-center">
          <div className="search">
            <CiSearch size={25} />
          </div>
          <div className="notification">
            {" "}
            <IoMdNotificationsOutline size={25} />
          </div>
        </div>
      </nav>
      <article className="w-[90%] mx-auto flex justify-between items-center">
        <h1 className="font-light text-3xl my-4">Your Notes</h1>
        <div
          onClick={() => setOpen(true)}
          className="plus py-2 px-2.5 rounded-lg font-bold text-xl border border-black border-solid"
        >
          <AiOutlinePlus />
        </div>
      </article>
      <div className="notes">
        {/* has to be generally fetched */}
        <div className="flex gap-3 overflow-hidden w-[90%] mx-auto">
          {categoryTag.map((item, index) => {
            return (
              <CategoryTag
                handleClick={handleColor}
                setCurrent={setCurrent}
                current={tag}
                tag={item}
                key={index}
              />
            );
          })}
        </div>
        <div className="secion-holder">
          {current === "all" ? (
            newSet?.map((uniqueSet, index) => {
              return (
                <section key={index} className="">
                  <div className="section-name overflow-hidden  py-2 mt-4 border-b border-b-1 mb-4 w-[90%] mx-auto border-b-black">
                    #{uniqueSet}
                  </div>
                  <div className="wrapper-cards py-4 w-[90%] mx-auto overflow-x-scroll md:overflow-hidden">
                    <div className="card-holder my-5  ml-4 inline-flex md:ml-4  w-auto md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 md:w-[90%] mx-auto">
                      {render.length > 0 &&
                        render
                          ?.filter((data) => data.category === uniqueSet)
                          .map((item, index) => <Card {...item} key={index} />)}
                    </div>
                  </div>
                </section>
              );
            })
          ) : (
            <section>
              <div className="section-name">
                <div className="tag w-[90%] mx-auto mt-4">
                  <article>#{tag}</article>
                </div>
                <div className="card-holder w-[90%] mx-auto mt-4 grid grid-cols-2 md:grid-cols-4">
                  {render.length > 0 &&
                    render?.map((item, index) => {
                      return <Card {...item} key={index} />;
                    })}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
};
export default Page;
