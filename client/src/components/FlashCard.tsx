"use client";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { Data } from "../data";
import { toast } from "react-toastify";
import BASE_URL from "../constants/index";
import { BackgroundBeams } from "./BackgroundBeams";
import { Icon } from "./Icon";
import Loading from "./Loading";

function FlashCard() {
  const [frontside, setFrontside] = useState<boolean>(true);
  const [data, setData] = useState<Data[]>([]);
  const [idx, setIdx] = useState<number>(0);

  const toggleSide = () => {
    setFrontside((prev) => !prev);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/flashcards`);
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch data");
    }
  };

  const handleInc = () => {
    if (!frontside) {
      setFrontside(true);
    }
    if (idx < data.length - 1) {
      setIdx((prevIdx) => prevIdx + 1);
    }
  };

  const handleDec = () => {
    if (!frontside) {
      setFrontside(true);
    }
    if (idx > 0) {
      setIdx((prevIdx) => prevIdx - 1);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(()=>{
  //   const cussorDot: any = document.querySelector(".dot")
  //   window.addEventListener("mousemove",(e)=>{
  //     const posX = e.clientX;
  //     const posY = e.clientY;
  //     cussorDot.animate({
  //       left : `${posX+20}px`,
  //       top : `${posY+20}px`
  //     },{
  //       duration : 1000,
  //       fill : "forwards"
  //     })
  //   })
  // })

  if (data.length === 0) {
    return <div className="w-[100vw] h-[100vh]">
      <Loading></Loading>
    </div>;
  }

  return (
    <>
    {/* <Loading></Loading> */}
    <div className="relative w-full h-screen overflow-hidden">
      <BackgroundBeams className="absolute inset-0 -z-10" />
        {/* <div className="dot"></div> */}
      <div className="relative z-10 flex flex-col">
        <div className="w-full h-[7vh]">
          <Navbar />
        </div>
        <div className="w-full h-[93vh] flex justify-center items-center">
          <div className="relative flex items-center justify-between">
            <div
              onClick={handleDec}
              className="bg-transparent text-white text-[15px] py-[5px] px-[15px] cursor-pointer rounded-[13px]"
            >
              Previous
            </div>
            <div className="min-w-[80%]">
              <div className="flex min-w-[90%]">
                <div
                onClick={handleDec}
                  id="frontside"
                  className={` cursor-pointer w-[25vw] h-[80vh] scale-75 ${
                    idx > 0 ? "border-[#4a4949] border-[1px] text-white shadow-2xl" : ""
                  }`}
                >
                  {idx > 0 && (
                    <>
                      <Icon className="absolute w-6 h-6 text-white -top-[2%] -left-[3.7%]" />
                      <Icon className="absolute w-6 h-6 text-white -top-[2%] -right-[3.7%]" />
                      <Icon className="absolute w-6 h-6 text-white top-[98%] -left-[3.7%]" />
                      <Icon className="absolute w-6 h-6 text-white top-[98%] -right-[3.7%]" />
                    </>
                  )}
                  <div className="text-left h-[100%] w-[100%] r">
                    <div className="py-[40px] px-[30px] text-[40px]">
                      {idx > 0 && (
                        <>
                          <span className="text-red-400">Question: </span>
                          {` ${data[idx - 1].question}`}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {frontside && (
                  <div
                    id="frontside"
                    className="w-[25vw] h-[80vh] mx-[70px] shadow-2xl border-[1px] border-[#4a4949]"
                    onClick={toggleSide}
                  >
                    <Icon className="absolute w-6 h-6 text-white -top-[2%] left-[36.59%]" />
                    <Icon className="absolute w-6 h-6 text-white -top-[2%] right-[35%]" />
                    <Icon className="absolute w-6 h-6 text-white top-[98%] left-[36.59%]" />
                    <Icon className="absolute w-6 h-6 text-white top-[98%] right-[35%]" />
                    <div className="text-left h-[100%] w-[100%] r">
                      <div className="py-[40px] px-[30px] text-[#fff] text-[40px]">
                        <span className="text-red-400">Question : </span> {data[idx].question}
                      </div>
                    </div>
                    <div className="text-center text-white mt-[5px]">CLICK FLASHCARD TO REVEAL ANSWER</div>
                  </div>
                )}
                {!frontside && (
                  <div
                    id="backside"
                    className="w-[25vw] h-[80vh] mx-[70px] shadow-2xl border-[#4a4949] border-[1px] text-white"
                    onClick={toggleSide}
                  >
                    <Icon className="absolute w-6 h-6 text-white -top-[2%] left-[36.59%]" />
                    <Icon className="absolute w-6 h-6 text-white -top-[2%] right-[35%]" />
                    <Icon className="absolute w-6 h-6 text-white top-[98%] left-[36.59%]" />
                    <Icon className="absolute w-6 h-6 text-white top-[98%] right-[35%]" />
                    <div className="text-left h-[100%] w-[100%]">
                      <div className="py-[40px] px-[30px] text-[20px]">
                        <span className="text-green-400">Answer : </span> {data[idx].answer}
                      </div>
                    </div>
                    <div className="text-center text-white mt-[5px]">CLICK FLASHCARD TO REVEAL ANSWER</div>
                  </div>
                )}
                <div
                onClick={handleInc}
                  id="frontside"
                  className={`w-[25vw] h-[80vh] scale-75 cursor-pointer ${
                    idx < data.length - 1 ? "border-[#4a4949] border-[1px] text-white shadow-2xl" : ""
                  }`}
                >
                  {idx < data.length - 1 && (
                    <>
                      <Icon className="absolute w-6 h-6 text-white -top-[2%] -left-[3.7%]" />
                      <Icon className="absolute w-6 h-6 text-white -top-[2%] -right-[3.7%]" />
                      <Icon className="absolute w-6 h-6 text-white top-[98%] -left-[3.7%]" />
                      <Icon className="absolute w-6 h-6 text-white top-[98%] -right-[3.7%]" />
                    </>
                  )}
                  <div className="text-left h-[100%] w-[100%] r">
                    <div className="py-[40px] px-[30px] text-[40px]">
                      {idx < data.length - 1 && (
                        <>
                          <span className="text-red-400">Question : </span> {data[idx + 1].question}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={handleInc}
              className="bg-transparent text-white text-[15px] py-[5px] px-[15px] cursor-pointer rounded-[13px]"
            >
              Next
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default FlashCard;
