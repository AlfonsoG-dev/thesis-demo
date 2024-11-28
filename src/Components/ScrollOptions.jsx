import { useState, useEffect } from "react"
import { BsFileArrowDownFill, BsFileArrowUpFill } from "react-icons/bs"
export default function ScrollOptions() {
    const [showScrollToTop, setShowScrollToTop] = useState(false)
    const [showScrollToBottom, setShowScrollToBottom] = useState(false)
    const handle_go_top = (e) => {
        e.preventDefault()
        window.scrollTo({top: 0, left: 0, behavior: 'smooth' })
    }
    const handle_go_down = (e) => {
        e.preventDefault()
        window.scrollTo({top: document.documentElement.scrollHeight, behavior: 'smooth'})
    }
    const my_handler = () => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY
            const documentHeight = document.documentElement.scrollHeight
            const windowHeight = window.innerHeight

            setShowScrollToTop(scrollPosition > windowHeight / 2)
            setShowScrollToBottom(scrollPosition < documentHeight - windowHeight - 50)
        }

        window.addEventListener('scroll', handleScroll)

        // Initial check
        handleScroll()

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }
    useEffect(() => {
        my_handler()
    }, [])
    return(
        <div className="">
            {
                showScrollToTop &&
                    <span className="arrow" onClick={handle_go_top}>
                        <BsFileArrowUpFill/> 
                    </span >
            }
            {

                showScrollToBottom &&
                    <span className="arrow" onClick={handle_go_down}>
                        <BsFileArrowDownFill/>
                    </span>
            }
        </div>
    )
}
