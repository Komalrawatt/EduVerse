import React from 'react'
import {Link} from 'react-router-dom'

const Button = ({children,active, linkto}) => {
  return (
   <Link to={linkto}>
   <div className={`h-[50px]  text-center text-[17px] px-6 py-3 rounded-md font-bold
            ${active ? "bg-[#FED60B] text-black" : "bg-richblack-800"}
            transition-all duration-200 hover:scale-95
        `}>
    {children}
   </div>
   </Link>

  )
}

export default Button