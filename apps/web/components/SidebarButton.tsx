import type { ComponentChildren } from "preact";

interface SidebarButtonProps {
  class: string;
  srOnly: string;
  children: ComponentChildren;
  onClick: () => void;
}

export function SidebarButton(props: SidebarButtonProps) {
  return (
    <button type="button" onClick={props.onClick} class={props.class}>
      <span class="sr-only">{props.srOnly}</span>
      {props.children}
    </button>
  );
}
