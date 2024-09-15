import { useEffect, useState } from "react";
import { db } from "@/utils";

type Theme = {
  colors: {
    [key: string]: any;
  };
  typography: {
    [key: string]: any;
  };
  spacing: {
    [key: string]: any;
  };
};

export const initialTheme: Theme = {
  colors: {},
  typography: {},
  spacing: {},
};

export const useThemeData = () => {
  const [themeData, setThemeData] = useState<Theme | null>(null);

  useEffect(() => {
    const fetchThemeData = async () => {
      const existingTabs = await db.get<Theme>("themeData");
      setThemeData(existingTabs ?? initialTheme);
    };

    fetchThemeData();
  }, []);

  const updateThemeData = async (newData: Theme) => {
    await db.set("themeData", newData);
    setThemeData(newData);
  };

  const updateTheme = async (group: keyof Theme, key: string, value: any) => {
    const newThemeData = { ...themeData } as Theme;
    newThemeData[group][key] = value;

    await updateThemeData(newThemeData);
  };

  return { themeData, updateTheme };
};
