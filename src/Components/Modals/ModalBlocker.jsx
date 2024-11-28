// Dependencies
import { useBlocker } from "react-router-dom"
import PropTypes from "prop-types"

// Icons
import { FaCheckCircle } from "react-icons/fa"
import { MdCancel } from "react-icons/md"

export default function ModalBlocker({isCompleted}) {
    const blocker = useBlocker(
        ({currentLocation, nextLocation}) => currentLocation.pathname !== nextLocation.pathname && nextLocation.pathname !== "/"
    )
    if (blocker.state === "blocked" && !isCompleted) {
        return (
            <div className="modal display-block">
                <section className="modal-main">
                    <h3>¿Estás seguro de abandonar la página?</h3>
                    <button onClick={() => blocker.proceed?.()}>
                        <FaCheckCircle/>
                    </button>
                    <button onClick={() => blocker.reset?.()}>
                        <MdCancel/>
                    </button>
                </section>
            </div >
        );
    }

    if(isCompleted) {
        blocker.proceed?.()
    }
}

ModalBlocker.propTypes = {
    isCompleted: PropTypes.bool
}
