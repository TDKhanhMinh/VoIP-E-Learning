export const loadingController = {
    start: () => { },
    stop: () => { },
};

export const registerLoadingController = (start, stop) => {
    loadingController.start = start;
    loadingController.stop = stop;
};
