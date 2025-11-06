import User from "../model/user.js";

export const getSipCredentials = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User không tồn tại");
    }

    const sipId = user.email.split("@")[0];
    const sipPassword = user.sipPassword;

    if (!sipPassword) {
        throw new Error("User chưa được đồng bộ sang Asterisk (thiếu sipPassword)");
    }

    return {
        sipId,
        sipPassword,
        displayName: user.full_name,
    };
};
