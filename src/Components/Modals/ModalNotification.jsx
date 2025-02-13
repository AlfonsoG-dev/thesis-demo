// Dependencies
import { useEffect } from "react"
import { GoEyeClosed } from "react-icons/go"
import PropTypes from "prop-types"


// style
import '../../Styles/Modal.css'

export default function ModalNotification({show, message, type, handle_close}) {
    const show_hidden = show ? "modal display-block" : "modal display-none"
    useEffect(() => {
        let timer;
        if (show) {
            if (type === "error") {
                timer = setTimeout(() => {
                    handle_close()
                }, 3000);
            } else if (type === "msg") {
                timer = setTimeout(() => {
                    handle_close()
                }, 2000);
            }
        }

        return () => clearTimeout(timer);
    }, [show, type, handle_close]);
    return(
        <div className={show_hidden}>
            <section className="modal-main">
                <span className="close" onClick={handle_close}>
                    <GoEyeClosed />
                </span>
                <h3>{message}</h3>
            </section>
        </div>
    )
}

ModalNotification.propTypes = {
    show: PropTypes.bool,
    message: PropTypes.string,
    type: PropTypes.string,
    handle_close: PropTypes.func
}
