"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "bg-gray-900 text-white border border-gray-700", // dark bg + white text
          title: "text-white",
          description: "text-gray-200",
          actionButton: "bg-white text-gray-900 hover:bg-gray-200",
          cancelButton: "bg-gray-800 text-gray-300 hover:bg-gray-700",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
