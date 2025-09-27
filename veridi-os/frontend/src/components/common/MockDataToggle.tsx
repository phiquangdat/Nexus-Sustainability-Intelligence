import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

const MockDataToggle = () => {
  const [supabaseConnected, setSupabaseConnected] = useState(false);

  useEffect(() => {
    // Check Supabase connectivity on component mount
    const checkSupabase = async () => {
      try {
        const { error } = await supabase
          .from("power_plants")
          .select("count")
          .limit(1);
        setSupabaseConnected(!error);
      } catch (err) {
        setSupabaseConnected(false);
      }
    };
    checkSupabase();
  }, []);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-50">
      <h3 className="text-sm font-semibold mb-2 text-neutral-900 dark:text-white">
        Development Tools
      </h3>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <label className="text-sm text-neutral-700 dark:text-neutral-300">
            Supabase Data
          </label>
        </div>
      </div>

      <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
        Database Status:{" "}
        {supabaseConnected ? "🟢 Connected" : "🔴 Disconnected"}
      </div>
    </div>
  );
};

export default MockDataToggle;
