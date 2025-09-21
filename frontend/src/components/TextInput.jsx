import React from "react";

function TextInput({
    label,
    value,
    name,
    onChange,
    placeholder = "",
    type = "text",
    error = "",
    className = "",
    ...props
}) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm font-normal text-gray-700">{label}</label>}

            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`
          w-full px-3 py-2 border rounded-lg outline-none
          focus:ring-2 focus:ring-blue-400
          ${error ? "border-red-500" : "border-gray-300"}
          ${className}
        `}
                {...props}
            />


            {error && <span className="text-xs text-start text-red-500">{error}</span>}
        </div>
    );
}

export default TextInput;
