import { useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const handleDownLoad = () => {
        window.open("https://drive.google.com/uc?export=download&id=1HvREDAjhvTZcT8XCi7nj5APDe-yRWDsK", "_blank");
    }

    return (
        <div className='bg-transparent w-[100vw] h-[100%] mt-[20px] flex flex-row justify-between'>
            <div className='flex gap-[50px] ml-[75px]'>
                <a className='text-[#5e5d5d] selection:transition  ease-linear hover:text-[#fff] text-[17px] mt-[3px]' href='https://github.com/DevItaliya22?tab=repositories'>Github</a>
                <a className='text-[#5e5d5d] selection:transition ease-linear hover:text-[#fff] text-[17px] mt-[3px]' href='https://www.linkedin.com/in/dev-italiya-0a3a2b273/'>Linkedin</a>
                <a className='text-[#5e5d5d] selection:transition ease-linear hover:text-[#fff] text-[17px] mt-[3px]' href="https://drive.google.com/file/d/1HvREDAjhvTZcT8XCi7nj5APDe-yRWDsK/view?usp=drive_link">Resume</a>
                <a className='text-[#5e5d5d] selection:transition ease-linear hover:text-[#fff] text-[16px] mt-[3px] cursor-pointer' onClick={handleDownLoad}>
                    Download Resume
                </a>
            </div>
            <div className='mr-[75px] text-[#5e5d5d] transition ease-linear text-[20px] cursor-pointer hover:text-[#fff]' onClick={() => navigate("/admin")}>
                Admin Panel
            </div>
        </div>
    );
}

export default Navbar;