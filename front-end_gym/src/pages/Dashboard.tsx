// src/pages/Dashboard.tsx
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

interface Workout {
  id: number;
  title: string;
  description?: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const res = await fetch("/api/workouts", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        if (!res.ok) throw new Error("Impossible de charger les entraînements");
        const data: Workout[] = await res.json();
        setWorkouts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkouts();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={logout}
          className="text-red-500 hover:text-red-700 font-medium"
        >
          Se déconnecter
        </button>
      </header>

      <main className="p-6">
        <p className="mb-6 text-gray-700">
          Bienvenue, <span className="font-semibold">{user?.email}</span> !
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-4">Mes entraînements</h2>

          {loading && <p>Chargement en cours...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading &&
            !error &&
            (workouts.length > 0 ? (
              <ul className="space-y-4">
                {workouts.map((w) => (
                  <li
                    key={w.id}
                    className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-medium">{w.title}</h3>
                    {w.description && (
                      <p className="text-gray-600 mt-1">{w.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Aucun entraînement trouvé.</p>
            ))}
        </section>
      </main>
    </div>
  );
}
