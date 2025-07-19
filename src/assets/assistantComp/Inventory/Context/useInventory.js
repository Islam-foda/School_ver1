import { useContext } from "react";
import { InventoryContext } from "./InventoryContext";

// Custom hook to use inventory context
export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within InventoryProvider");
  }
  return context;
};
