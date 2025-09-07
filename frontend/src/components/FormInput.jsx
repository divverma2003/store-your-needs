import React from "react";

// Label, name, type, required, placeholder, icon, value
const FormInput = (props) => {
  // Handler to call parent's onChange with just the new value (callback)
  const handleChange = (event) => {
    props.onChange(event.target.value);
    // console.log(event.target.value);
  };

  return (
    <div>
      <div>
        <label
          htmlFor={props.name}
          className="block text-sm font-medium text-gray-300"
        >
          {props.label}
        </label>
        {props.type === "textarea" && (
          <textarea
            id={props.name}
            name={props.name}
            value={props.value}
            onChange={(event) => handleChange(event)}
            rows="3"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
                         py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
                         focus:border-emerald-500"
            required={props.required}
          />
        )}
        {props.type === "select" && (
          <select
            id={props.name}
            name={props.name}
            value={props.value}
            onChange={(event) => handleChange(event)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
                         shadow-sm py-2 px-3 text-white focus:outline-none 
                         focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required={props.required}
          >
            <option value="">Select a category</option>
            {props.options.map((option) => (
              <option key={option} value={option}>
                {option
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
        )}
        {props.type !== "textarea" &&
          props.type !== "select" &&
          props.type !== "file" && (
            <div className="mt-1 relative rounded-md shadow-sm">
              {props.icon ? (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {React.createElement(props.icon, {
                    className: "h-5 w-5 text-gray-400",
                    "aria-hidden": "true",
                  })}
                </div>
              ) : null}
              <input
                id={props.name}
                name={props.name}
                type={props.type}
                required={props.required}
                value={props.value}
                step={props.step}
                min={props.min}
                onChange={(event) => handleChange(event)}
                className={`block w-full px-3 py-2 ${
                  props.icon ? "pl-10" : ""
                } bg-gray-700 border border-gray-600 rounded-md shadow-sm
                                     placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                placeholder={props.placeholder}
              />
            </div>
          )}
      </div>
    </div>
  );
};

export default FormInput;
