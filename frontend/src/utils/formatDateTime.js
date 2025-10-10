const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date
        .toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        .replace(",", "");
};
export default formatDateTime;