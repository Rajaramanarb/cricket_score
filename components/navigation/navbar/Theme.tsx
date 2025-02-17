"use client";
import React from "react";
import Image from "next/image";
import { Button } from "../../ui/button";
import { useTheme } from "next-themes";

const Theme = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant={"ghost"}
      onClick={() => {
        const themeToBeSwitched = theme === "light" ? "dark" : "light";
        setTheme(themeToBeSwitched);
        localStorage.theme = themeToBeSwitched;
      }}
    >
      {theme === "light" ? (
        <Image
          src="/icons/sun.svg"
          alt="Sun"
          width={20}
          height={20}
          title="Light theme"
          className="active-theme"
        />
      ) : (
        <Image
          src="/icons/moon.svg"
          alt="Moon"
          width={20}
          height={20}
          title="Dark theme"
          className="active-theme"
        />
      )}
    </Button>
  );
};

export default Theme;
