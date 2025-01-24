import { forwardRef } from "preact/compat";

export const Button = forwardRef<HTMLButtonElement>((props, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      class="px-2 py-1 border-gray-500 border-2 rounded bg-white hover:bg-gray-200 transition-colors"
    />
  );
});
