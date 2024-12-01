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
        const handle_scroll = () => {
            const scroll_position = window.scrollY
            const document_height = document.documentElement.scrollHeight
            const window_height = window.innerHeight

            setShowScrollToTop(scroll_position > window_height / 2)
            setShowScrollToBottom(scroll_position < document_height - window_height - 50)
        }

        window.addEventListener('scroll', handle_scroll)

        // Initial check
        handle_scroll()

        return () => {
            window.removeEventListener('scroll', handle_scroll)
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
