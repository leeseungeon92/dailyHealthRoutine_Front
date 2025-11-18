import React from "react";

export default function Input({
    label,
    type = "text",
    value,
    onChange,
    placeHolder,
}){
    return(
        <div>
            {label}
            <input
                type={type}
                value={value}
                placeholder={placeHolder}
                onChange={onChange}
            />
        </div>
    )
}