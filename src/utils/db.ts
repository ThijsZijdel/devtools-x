import { Store } from "tauri-plugin-store-api";
import { defaultConfig } from "@/Contexts/AppContextProvider";
import { initialTheme } from "@/hooks/useThemeData";

const db = new Store("settings.json");

if (!(await db.length())) {
  await Promise.all([
    db.set("firstTime", true),
    db.set("jsoneditor", {}),
    db.set("hashes", ""),
    db.set("pinned", []),
    db.set("epoch", {}),
    db.set("password", {}),
    db.set("sidebar", []),
    db.set("config", defaultConfig),
    db.set("themeData", initialTheme),
  ]);
  await db.save();
}

if (import.meta.env.DEV) {
  (window as any).db = db;
}
export { db };
