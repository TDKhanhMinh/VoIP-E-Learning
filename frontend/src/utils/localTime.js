export const toLocalTime = (utcString) => {
    const date = new Date(utcString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const local = new Date(date.getTime() + tzOffset);
    return local.toISOString().slice(0, 10);
};
