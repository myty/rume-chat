import { forwardRef } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        className={className ?? "bg-white shadow-md rounded-md p-6 h-12 w-12"}
        ref={ref}
        {...props}>
        {children}
      </div>
    );
  },
);

export default Card;
