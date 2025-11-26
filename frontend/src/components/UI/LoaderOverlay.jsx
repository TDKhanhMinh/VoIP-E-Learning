import { UseLoading } from "../../context/LoadingContext";
import { registerLoadingController } from "../../context/LoadingController";

const LoaderOverlay = () => {
    const { loading, startLoading, stopLoading } = UseLoading();

    registerLoadingController(startLoading, stopLoading);

    if (!loading) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-50">
            <span className="loader"></span>
        </div>
    );
};

export default LoaderOverlay;
