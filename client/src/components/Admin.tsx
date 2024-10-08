import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Data } from "../data";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../constants/index";
import { BackgroundBeams } from "./BackgroundBeams";

function Admin() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [modalQ, setModalQ] = useState<string>('');
    const [modalA, setModalA] = useState<string>('');
    const [modalId, setModalId] = useState<number>(0);
    const [modalType, setModalType] = useState<string>('');
    const [data, setData] = useState<Data[]>([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/flashcards`);
            if (response.status === 200) {
                setData(response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch data',{
                autoClose: 700
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openModal = (data : {item: Data, type: string}) => {
        setModalId(data.item.id);
        setModalQ(data.item.question);
        setModalA(data.item.answer);
        setModalType(data.type);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await axios.post(`${BASE_URL}/flashcards/delete/${id}`);
            console.log(response.data);
            
            if (response.status === 200) {
                toast.success('Item deleted successfully',{
                    autoClose: 700
                });
                setData(prevData => prevData.filter(item => item.id !== id)); 
            }
        } catch (error) {
            
            console.log(error);
            
            toast.error('Failed to delete item',{
                autoClose: 700
            });
        }
    }

    const handleSubmit = async () => {
        if (modalQ === '' || modalA === '') {
            toast.error('Please fill all the fields', {
                autoClose: 700
            });
            return;
        }
        closeModal();
    
        const requestData = {
            question: modalQ,
            answer: modalA
        };
    
        try {
            console.log('Submitting request...');
            let response: any;
            if (modalType === 'add') {
                response = await axios.post(`${BASE_URL}/flashcards/create`, requestData);
                // console.log( response.data);
                    toast.success('Item added successfully', {
                        autoClose: 700
                    });
                    setData(prevData => [...prevData, response.data]);
                
            } else {
                response = await axios.post(`${BASE_URL}/flashcards/update/${modalId}`, requestData);
                console.log('Response received:', response); 
                if (response.status === 200 && response.data) {
                    console.log('Response data:', response.data); 
                    setData(prevData =>
                        prevData.map(item =>
                            item.id === modalId ? { ...item, ...response.data } : item
                        )
                    );
                    toast.success('Item updated successfully', {
                        autoClose: 700
                    });
                }
            }
        } catch (error) {
            console.error('Error occurred:', error);
            toast.error(`Failed to ${modalType === 'add' ? 'add' : 'update'} item`, {
                autoClose: 700
            });
        }
    };
    // useEffect(()=>{
    //     const cussorDot: any = document.querySelector(".dot")
    //     window.addEventListener("mousemove",(e)=>{
    //       const posX = e.clientX;
    //       const posY = e.clientY;
    //       cussorDot.animate({
    //         left : `${posX+20}px`,
    //         top : `${posY+20}px`
    //       },{
    //         duration : 1000,
    //         fill : "forwards"
    //       })
    //     })
    //   })
    

    return (
        <div className="flex flex-col items-center justify-center">
            <ToastContainer />
            {/* <div className="dot"></div> */}
            <BackgroundBeams className="fixed inset-0 -z-10" />
            <div className=" w-[10vw] h-[8vh] flex flex-row justify-between rounded-[30px] mt-[20px]">
                    <div
                        className="border-[1px] bg-black text-[#7d7c7c] selection:transition ease-linear hover:text-[#fff] border-white pl-[50px] text-[3vh] pt-[1.6vh] pb-[2vh] pr-[50px] cursor-pointer select-none"  
                        onClick={() => navigate("/")}
                    >
                        Home
                    </div>

            </div>

            <div className="flex flex-col w-[80%] mt-[50px]">
                <div className="flex justify-center w-full p-4 border-[2px] border-b-[6px] border-r-[6px]">
                <div className="text-white text-[15px] mt-[10px] mr-[20px]">Add new FlashCards from here : </div>
                    <button
                        className="px-4 py-2 text-white bg-blue-500 rounded"
                        onClick={() => openModal({type:'add', item:{id:-1, question:'', answer:''}})}
                    >
                        Add item
                    </button>
                </div>
                {data.length === 0 ? <>NO DATA FOUND </> : 
                <div className="mt-[20px]">
                <div className="h-auto my-[10px]">
                <div className="text-white">Try deleting more than 5 items in less than 10 sec , I have used rate limiting in delete specifically. </div>
                    {data.map((item: Data, idx: number) => (
                        <div className="flex border-[2px] p-[3px] m-[20px]" key={idx}>
                            <div className="flex w-[100%] bg-black flex-col text-white justify-between p-4">
                                <div>
                                    <span className="text-red-400">Question: </span> {item.question}
                                </div>
                                <div className="font-600">
                                    <span className="text-green-600">Answer: </span> {item.answer}
                                </div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <button
                                    onClick={() => openModal({type:'update', item})}
                                    className="px-4 py-2 text-white bg-blue-500 rounded"
                                >
                                    Update
                                </button>
                                <button
                                onClick={() => handleDelete(item.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded mt-[5px]"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>}
            </div>

            {showModal && (
                <div
                    onClick={closeModal}
                    className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white p-8 rounded w-[40vw] h-[40vh]"
                    >
                        <h2 className="mb-4 text-xl">Your Flashcard</h2>
                        <input
                            type="text"
                            placeholder="Question"
                            className="w-full p-2 mb-4 border"
                            value={modalQ}
                            onChange={(e) => setModalQ(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Answer"
                            className="w-full p-2 mb-4 border"
                            value={modalA}
                            onChange={(e) => setModalA(e.target.value)}
                        />
                        <button
                        onClick={handleSubmit}
                            className="bg-green-500 text-white px-4 py-2 rounded mt-[20px] mr-[20px]"
                        >
                            Submit
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded mt-[20px]"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;