import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all text-sm inline-flex items-center justify-center";
  const variants = {
    default: "bg-[#00B5E2] hover:bg-[#009ac0] text-black font-bold",
    outline: "border border-slate-700 hover:bg-slate-800 text-white",
    ghost: "hover:bg-slate-800 text-slate-300",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
