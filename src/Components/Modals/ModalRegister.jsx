import { FaCheckCircle } from "react-icons/fa"
import { MdCancel } from "react-icons/md"

import PropTypes from "prop-types"

import '../../Styles/Modal.css'
export default function ModalRegister({show, message, handle_close, handle_confirm}) {
    const show_hidden = show ? "modal display-block" : "modal display-none"
    return (
        <div className={show_hidden}>
            <section className='modal-main'>
                <span
                    className="close"
                    onClick={handle_close}
                >
                    &times;
                </span>
                <h3>{message}</h3>
                <button onClick={handle_confirm}>
                    <FaCheckCircle />
                </button>
                <button onClick={handle_close}>
                    <MdCancel />
                </button>
            </section >
        </div>
    )
}

ModalRegister.propTypes = {
    show: PropTypes.bool,
    message: PropTypes.string,
    handle_close: PropTypes.func,
    handle_confirm: PropTypes.func
}
