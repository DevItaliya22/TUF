import { useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate();
  return (
    <div className='bg-red-500 w-[100vw] h-[100%] flex flex-row justify-between'>
      <div className='flex gap-[50px] ml-[75px]'>
        <a className='text-[#000] text-[17px] mt-[3px]' href='https://github.com/DevItaliya22?tab=repositories'>Github</a>
        <a className='text-[#000] text-[17px] mt-[3px]' href='https://www.linkedin.com/in/dev-italiya-0a3a2b273/'>Linkedin</a>
        <a className='text-[#000] text-[17px] mt-[3px]' href="https://drive.google.com/file/d/1HvREDAjhvTZcT8XCi7nj5APDe-yRWDsK/view?usp=drive_link" >Resume</a>
        <a className='text-[#000] text-[16px] mt-[3px] cursor-pointer' href="../../Resume.pdf" download="Dev_Italiya_Resume.pdf">
            Download Resume
        </a>
      </div>
      <div className='mr-[75px] text-[20px] cursor-pointer' onClick={()=>navigate("/admin")}>
        Admin Panel
      </div>
    </div>
  )
}

export default Navbar
