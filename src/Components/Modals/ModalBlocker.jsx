// Dependencies
import { useBlocker } from "react-router-dom"
import PropTypes from "prop-types"

// Icons
import { FaCheckCircle } from "react-icons/fa"
import { MdCancel } from "react-icons/md"

/**
 * Should block navigation when the *next location* isn't root.
 * Use it where you need to get a custom modal confirm dialog when leaving the page.
 * @param isCompleted the value for the rules of proceeding navigation or blocking.
 * If the isCompleted value is true allow navigation, otherwise block navigation.
 */
export default function ModalBlocker({isCompleted}) {
    const blocker = useBlocker(
        ({currentLocation, nextLocation}) => currentLocation.pathname !== nextLocation.pathname && nextLocation.pathname !== "/"
    )
    if (blocker.state === "blocked" && !isCompleted) {
        return (
            <div className="modal display-block">
                <section className="modal-main">
                    <h3>¿Estás seguro de abandonar la página?</h3>
                    <button onClick={() => blocker.proceed()}>
                        <FaCheckCircle/>
                    </button>
                    <button onClick={() => blocker.reset()}>
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
