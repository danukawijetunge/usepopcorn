import { useEffect } from "react";

export function useKey(key, operation) {
  console.log(`key ${key} operation is ${operation}`);

  useEffect(() => {
    function callback(e) {
      if (e.code === key) {
        operation();
      }
    }

    document.addEventListener("keydown", callback);

    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, [key, operation]);
}
