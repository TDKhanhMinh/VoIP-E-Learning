export const apps = [
    {
        name: "api",
        script: "src/server.js",
        watch: false,
    },
    // AWS S3 recording and its AI worker are currently unavailable.
    // {
    //     name: "worker",
    //     script: "src/service/aiWorkerService.js",
    //     watch: false,
    // },
];
