"use client";
import  { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { Data } from "../data";
import { toast } from "react-toastify";
import BASE_URL from "../constants/index";
import { BackgroundBeams } from "./BackgroundBeams"; // Import the BackgroundBeams component

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
      toast.error('Failed to fetch data');
    }
  };

  const handleInc = () => {
    if(!frontside){
      setFrontside(true)
    }
    if (idx < data.length - 1) {
      setIdx((prevIdx) => prevIdx + 1);
    }
  };

  const handleDec = () => {
    if(!frontside){
      setFrontside(true)
    }
    if (idx > 0) {
      setIdx((prevIdx) => prevIdx - 1);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <BackgroundBeams className="absolute inset-0 -z-10" />

      <div className="relative z-10 flex flex-col">
        <div className="w-full h-[7vh]">
          <Navbar />
        </div>
        <div className="w-full h-[93vh] flex justify-center items-center">
          <div className="relative flex items-center justify-between">
            <div
              onClick={handleDec}
              className= " bg-transparent text-white text-[15px] py-[5px] px-[15px] cursor-pointer rounded-[13px]"
            >
              Previous
            </div>
            <div className="min-w-[80%]">
              <div className="flex min-w-[90%]">
                <div
                  id="frontside"
                  className={`w-[25vw] h-[80vh] scale-75 rounded-[20px] ${idx > 0 ? "bg-white" : "bg-transparent"}`}
                >
                  
                  <div className="text-left h-[100%] w-[100%] r">
                      <div className="py-[40px] px-[30px] text-[40px]">
                      {idx > 0 && (
          <span className="text-red-400">Question: </span>
        )}
        {idx > 0 && ` ${data[idx - 1].question}`}
                      </div>
                    </div>
                </div>
                {frontside && (
                  <div
                    id="frontside"
                    className="w-[25vw] h-[80vh] mx-[70px] bg-[#fff] rounded-[30px] "
                    onClick={toggleSide}
                  >
                    {/* {data[idx].question} */}
                    <div className="text-left h-[100%] w-[100%] r">
                      <div className="py-[40px] px-[30px] text-[40px]">
                         <span className="text-red-400">Question : </span> {data[idx].question}
                      </div>
                    </div>
                  </div>
                )}
                {!frontside && (
                  <div
                    id="backside"
                    className="w-[25vw] rounded-[30px] h-[80vh] mx-[70px] bg-[#fff]"
                    onClick={toggleSide} 
                  >
                    <div className="text-left  h-[100%] w-[100%] ">
                      <div className="py-[40px] px-[30px] text-[20px]">
                      <span className="text-green-400">Answer : </span>  {data[idx].answer}
                      </div>
                    </div>
                  </div>
                )}
                <div
                  id="frontside"
                  className={`w-[25vw] h-[80vh] rounded-[20px] scale-75 ${idx < data.length - 1 ? "bg-white" : "bg-transparent"}`}
                >
                  
                  <div className="text-left h-[100%] w-[100%] r">
                      <div className="py-[40px] px-[30px] text-[40px]">
                         <span className="text-red-400">Question : </span> {idx < data.length - 1 && data[idx + 1].question}
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
  );
}

export default FlashCard;