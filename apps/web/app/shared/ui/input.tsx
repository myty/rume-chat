import { forwardRef } from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className={clsx("mt-2", className)}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
            {label}
          </label>
        )}
        <div>
          <input
            {...props}
            ref={ref}
            id={id}
            name={id}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
      </div>
    );
  },
);

export default Input;
