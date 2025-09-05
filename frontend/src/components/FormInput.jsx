import React from "react";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react";

// Label, name, type, required, placeholder, icon
const FormInput = (props) => {
  return (
    <div>
      <label
        htmlFor={props.name}
        className="block text-sm font-medium text-gray-300"
      >
        {props.label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {props.icon &&
            React.createElement(props.icon, {
              className: "h-5 w-5 text-gray-400",
              "aria-hidden": "true",
            })}
        </div>
        <input
          id={props.name}
          type={props.type}
          required={props.required}
          value={formData.name}
          onChange={(event) =>
            setFormData({ ...formData, name: event.target.value })
          }
          className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
									 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          placeholder={props.placeholder}
        />
      </div>
    </div>
  );
};

export default FormInput;
