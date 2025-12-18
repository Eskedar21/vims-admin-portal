import { createContext, useContext, useState } from "react";
import { mockCenters } from "../data/mockCenters";

const CentersContext = createContext(null);

export function CentersProvider({ children }) {
  const [centers, setCenters] = useState(() => {
    // Load from localStorage if available, otherwise use mock data
    const saved = localStorage.getItem("vims-centers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate existing centers to include monitoring fields if missing
        return parsed.map((center) => {
          if (!center.lastHeartbeat || !center.machineStatus) {
            // Add default monitoring data for centers that don't have it
            const mockCenter = mockCenters.find((mc) => mc.id === center.id);
            return {
              ...center,
              lastHeartbeat: center.lastHeartbeat || mockCenter?.lastHeartbeat || new Date(Date.now() - 300000).toISOString(),
              machineStatus: center.machineStatus || mockCenter?.machineStatus || [
                { name: "Brake Tester", status: "Offline" },
                { name: "Emissions Analyzer", status: "Offline" },
                { name: "Suspension Tester", status: "Offline" },
                { name: "Headlight Tester", status: "Offline" },
              ],
            };
          }
          return center;
        });
      } catch (e) {
        return mockCenters;
      }
    }
    return mockCenters;
  });

  const addCenter = (center) => {
    setCenters((prev) => {
      const updated = [center, ...prev];
      localStorage.setItem("vims-centers", JSON.stringify(updated));
      return updated;
    });
  };

  const updateCenter = (id, updates) => {
    setCenters((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      localStorage.setItem("vims-centers", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteCenter = (id) => {
    setCenters((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      localStorage.setItem("vims-centers", JSON.stringify(updated));
      return updated;
    });
  };

  const getCenterById = (id) => {
    return centers.find((c) => c.id === id);
  };

  return (
    <CentersContext.Provider
      value={{
        centers,
        addCenter,
        updateCenter,
        deleteCenter,
        getCenterById,
      }}
    >
      {children}
    </CentersContext.Provider>
  );
}

export function useCenters() {
  const context = useContext(CentersContext);
  if (!context) {
    throw new Error("useCenters must be used within CentersProvider");
  }
  return context;
}

