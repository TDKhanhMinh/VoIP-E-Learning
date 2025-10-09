import React, { useState } from "react";

export default function SelectField({
    label,
    name,
    options = [],
    value,
    onChange,
    required = false,
}) {
    const [touched, setTouched] = useState(false);

    const isError = required && touched && !value;

    return (
        <div className="mb-4">
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}{" "}
                    {required && <span className="text-red-500 font-bold">*</span>}
                </label>
            )}

            <select
                id={name}
                name={name}
                required={required}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={() => setTouched(true)}
                className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${isError ? "border-red-500" : "border-gray-300"
                    }`}
            >
                <option value="">-- Chọn {label?.toLowerCase() || "mục"} --</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label || opt.full_name || opt.name}
                    </option>
                ))}
            </select>

            {isError && (
                <p className="text-red-500 text-sm mt-1">
                    Vui lòng chọn {label?.toLowerCase() || "mục"}!
                </p>
            )}
        </div>
    );
}
