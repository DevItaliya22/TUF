import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { Data } from "../data";
import { toast } from "react-toastify";
import BASE_URL from "../constants/index";

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
    if (idx < data.length - 1) {
      setIdx((prevIdx) => prevIdx + 1);
    }
  };

  const handleDec = () => {
    if (idx > 0) {
      setIdx((prevIdx) => prevIdx - 1);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (data.length === 0) {
    return <div>No Data Found</div>;
  }

  return (
    <div className="flex  flex-col">
      <div className="w-[100vw]  h-[7vh]">
        <Navbar />
      </div>
      <div className="bg-red-500  w-[100vw] h-[93vh] flex justify-center items-center">
        <div className="flex justify-between items-center relative">
          <div
            onClick={handleDec}
            className= " bg-white text-black text-[15px] py-[5px] px-[15px] cursor-pointer rounded-[13px]"
          >
            Previous
          </div>
          <div className="min-w-[80%] ">
          <div className="flex min-w-[90%]">
            {(
              <div id="frontside" className={`w-[25vw] h-[80vh] scale-75 ${idx>0 ? "bg-white" : "bg-red-500"} `}>
                {idx > 0 && data[idx - 1].question}
              </div>
            )}
            {frontside && (
              <div
                id="frontside"
                className="w-[25vw] h-[80vh] mx-[70px] bg-[#fff]"
                onClick={toggleSide}
              >
                {data[idx].question}
              </div>
            )}
            {!frontside && (
              <div
                id="backside"
                className="w-[25vw] h-[80vh] mx-[70px] bg-[#fff]"
                onClick={toggleSide}
              >
                {data[idx].answer}
              </div>
            )}
            { (
              <div id="frontside" className={`w-[25vw] h-[80vh] scale-75 ${idx < data.length - 1 ? "bg-white" : "bg-red-500"} `}>
                {idx < data.length - 1 && data[idx + 1].question}
              </div>
            )}
          </div>
          </div>
          <div
            onClick={handleInc}
            className="bg-white text-black text-[15px] py-[5px] px-[15px] cursor-pointer rounded-[13px]"
          >
            Next
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlashCard;
