import { forwardRef } from "preact/compat";
import type { ComponentChildren, JSX } from "preact";

interface SidebarButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  class: string;
  srOnly: string;
  children: ComponentChildren;
  onClick: () => void;
}

export const SidebarButton = forwardRef<HTMLButtonElement, SidebarButtonProps>(
  (props, ref) => {
    return (
      <button
        type="button"
        onClick={props.onClick}
        class={props.class}
        ref={ref}>
        <span class="sr-only">{props.srOnly}</span>
        {props.children}
      </button>
    );
  },
);
