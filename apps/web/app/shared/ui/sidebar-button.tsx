import {
  type ButtonHTMLAttributes,
  forwardRef,
  type PropsWithChildren,
} from "react";
import { useMobileAppSidebar } from "./navigation/mobile-app-sidebar-provider.tsx";

interface SidebarButtonProps
  extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  class: string;
  srOnly: string;
  onClick?: () => void;
}

export const SidebarButton = forwardRef<HTMLButtonElement, SidebarButtonProps>(
  (props, ref) => {
    const { open } = useMobileAppSidebar();

    const handleClick = () => {
      if (props.onClick) {
        props.onClick();
        return;
      }

      open();
    };

    return (
      <button
        type="button"
        onClick={handleClick}
        className={props.class}
        ref={ref}>
        <span className="sr-only">{props.srOnly}</span>
        {props.children}
      </button>
    );
  },
);
