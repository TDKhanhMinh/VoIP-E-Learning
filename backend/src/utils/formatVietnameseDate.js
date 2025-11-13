export const formatVietnameseDate = (dateInput) => {
    const date = new Date(dateInput);

    const options = {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };

    return date.toLocaleDateString('vi-VN', options);
};