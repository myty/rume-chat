import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

export const Button = forwardRef<
  HTMLButtonElement,
  JSX.ButtonHTMLAttributes<HTMLButtonElement>
>((buttonProps, ref) => {
  const { class: classProp, ...props } = buttonProps;

  return (
    <button
      ref={ref}
      {...props}
      class={`px-2 py-1 border-gray-500 border-2 rounded bg-white hover:bg-gray-200 transition-colors ${classProp}`}
    />
  );
});
