import {
  forwardRef,
  type ButtonHTMLAttributes,
  type PropsWithChildren,
} from "react";

interface SidebarButtonProps
  extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  class: string;
  srOnly: string;
  onClick: () => void;
}

export const SidebarButton = forwardRef<HTMLButtonElement, SidebarButtonProps>(
  (props, ref) => {
    return (
      <button
        type="button"
        onClick={props.onClick}
        className={props.class}
        ref={ref}>
        <span className="sr-only">{props.srOnly}</span>
        {props.children}
      </button>
    );
  },
);
