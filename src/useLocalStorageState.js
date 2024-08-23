import { useState, useEffect } from "react";

export function useLocalStorageState(key) {
  const [value, setValue] = useState(function () {
    let storedData =
      localStorage.getItem(key) != undefined
        ? JSON.parse(localStorage.getItem(key))
        : [];

    return storedData;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
