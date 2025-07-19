import { type ButtonHTMLAttributes, forwardRef } from "react";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>((buttonProps, ref) => {
  const { className: classProp, ...props } = buttonProps;

  return (
    <button
      ref={ref}
      {...props}
      className={`px-2 py-1 border-gray-500 border-2 rounded bg-white hover:bg-gray-200 transition-colors ${classProp}`} />
  );
});
