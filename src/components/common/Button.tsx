import React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "success";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  outlined?: boolean; // Add outlined as a boolean prop
}

export default function Button({
  type = "button",
  variant = "primary",
  children,
  onClick,
  className = "",
  disabled = false,
  outlined = false, // Default to false
}: ButtonProps) {
  // Base styles for all buttons
  const baseStyles =
    "flex justify-center items-center py-2 px-4 rounded-lg font-medium text-sm transition duration-300 w-full";

  // Define styles for each variant
  const variants = {
    primary: {
      filled: "bg-[#6558f5] text-white hover:bg-[#5630de]",
      outlined: "border-2 border-[#6558f5] text-[#6558f5] hover:bg-[#6558f5] hover:text-white",
    },
    secondary: {
      filled: "bg-gray-300 text-gray-800 hover:bg-gray-400",
      outlined: "border-2 border-gray-300 text-gray-800 hover:bg-gray-300 hover:text-gray-800",
    },
    danger: {
      filled: "bg-red-600 text-white hover:bg-red-700",
      outlined: "border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white",
    },
    success: {
      filled: "bg-green-600 text-white hover:bg-green-700",
      outlined: "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white",
    },
  };

  // Determine the final styles based on variant and outlined prop
  const getVariantStyles = () => {
    const variantStyles = variants[variant];
    return outlined ? variantStyles.outlined : variantStyles.filled;
  };

  // Disabled state styles
  const disabledStyles = disabled
    ? "cursor-not-allowed opacity-60 hover:bg-transparent hover:!text-current"
    : "cursor-pointer";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${getVariantStyles()} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  );
}