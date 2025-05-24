// src/components/Button.tsx
import React from "react";
import classNames from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={classNames(
        "px-4 py-1 rounded-md font-semibold transition duration-200",
        "bg-orange-400 text-white hover:bg-orange-500",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default React.memo(Button);
