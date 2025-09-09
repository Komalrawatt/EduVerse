import { React, useState } from 'react'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { Link } from 'react-router-dom'
import { NavbarLinks } from "../../data/navbar-links"
import { useLocation, matchPath } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AiOutlineShoppingCart } from "react-icons/ai"
import ProfileDropDown from "../core/Auth/ProfileDropDown"
import { useEffect } from 'react'
import { categories } from '../../services/apis'
import { APIConnector } from "../../services/apiconnector"
import { IoIosArrowDropdownCircle } from "react-icons/io"

const subLinks=[
    {
        title:"python",
        link:"/catalog/python"
    },
    {
        title:"web dev",
        link:"/catalog/web-dev"
    }
]

const Navbar = () => {
    const location = useLocation();
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);
    const [subLinks, setSubLinks] = useState([]);

    const fetchSubLinks = async () => {
        try {
            const result = await APIConnector("GET", categories.CATEGORIES_API);
            console.log("Printing sublinks result", result);
            setSubLinks(result.data.data);
        }
        catch (error) {
            console.log("Could not fetch the cataog list");

        }
    }
    useEffect(() => {
        // fetchSubLinks();
    }, [])

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    }
    return (
        <div className='flex h-14 items-center justify-center border-b-[1px] border-b-[#2C333F]'>
            <div className='flex w-11/12 max-w-[1260px] items-center justify-between'>
                {/* Image */}
                <Link to="/">
                    <img src={logo} alt="" width={160} height={42} loading='lazy' />
                </Link>

                {/* Nav Links */}
                <nav>
                    <ul className='flex gap-x-6 text-richblack-25'>
                        {
                            NavbarLinks.map((link, index) => {

                                return <li key={index}>
                                    {
                                        link.title === "Catalog" ? (
                                            <div className='relative flex items-center gap-x-1 cursor-pointer group font-semibold'>
                                                <p>
                                                    {link.title}
                                                </p>
                                                <IoIosArrowDropdownCircle/>
                                                <div className='invisible absolute left-[50%] 
                                                translate-x-[-50%] translate-y-[80%] top-[50%]
                                                flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                                                opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]'>
                                                    
                                                     <div className='absolute left-[50%] top-0
                                                translate-x-[80%] translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5
                                                '>
                                                </div>
                                                 {
                                                        subLinks.length ? (
                                                            
                                                                subLinks.map((subLink, index)=>(
                                                                <Link to={`${subLink.link}`} key={index}>
                                                                    <p>{subLink.title}</p>
                                                                </Link>
                                                                ))
                                                            
                                                        ):(<div></div>)
                                                    }
                                                </div>
                                               
                                            
                                            </div>

                                                ) : (
                                                <Link to={link?.path}>
                                                    <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"} font-semibold`}>
                                                        {link.title}
                                                    </p>
                                                </Link>

                                                )
                                    }
                                            </li>

                            })
                        }
                                </ul>
                </nav>

                {/* Login/SignUp/Dashboard */}
                <div className='flex gap-x-4 items-center'>
                    {
                        user && user?.accountType != "Instructor" && (
                            <Link to="/dashboard/cart" className="relative">
                                <AiOutlineShoppingCart />
                                {
                                    totalItems > 0 && (
                                        <span className='absolute'>
                                            {totalItems}
                                        </span>
                                    )
                                }
                            </Link >
                        )

                    }
                    {
                        token === null && (
                            <Link to="/login">
                                <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md '>
                                    Log in
                                </button>
                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <Link to="/signup">
                                <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                    Sign up
                                </button>
                            </Link>
                        )
                    }
                    {
                        token !== null && <ProfileDropDown />
                    }

                </div>

            </div>
        </div>

    )
}

export default Navbar;