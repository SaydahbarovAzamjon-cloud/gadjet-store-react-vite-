import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import apiService from "@/lib/apiService";

// Backend /member/top-users dan kelgan tip
interface TopUser {
  _id: string;
  memberNick: string;
  memberPoints: number;
  memberImage?: string;
  memberType: string;
}

// Avatar ranglari — index bo'yicha
const COLORS = [
  "from-yellow-400 to-orange-500",
  "from-slate-400 to-slate-500",
  "from-amber-600 to-amber-700",
  "from-blue-500 to-purple-600",
];

// 1-chi, 2-chi, 3-chi yoki oddiy
const RANK_LABELS = ["🥇", "🥈", "🥉", ""];

export default function ActiveUsersSection() {
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GET /member/top-users — memberPoints bo'yicha top 4
    apiService
      .get("/member/top-users")
      .then(({ data }) => setTopUsers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Top Members
          </h2>
          <p className="text-muted-foreground">
            Eng faol foydalanuvchilar — member points bo'yicha
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-xl p-6 border border-border animate-pulse h-40" />
            ))}
          </div>
        ) : topUsers.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Hozircha top user yo'q</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topUsers.map((user, index) => (
              <div
                key={user._id}
                className="bg-card rounded-xl p-6 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
              >
                {/* Avatar */}
                {user.memberImage ? (
                  <img
                    src={`http://localhost:2005/${user.memberImage}`}
                    alt={user.memberNick}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                  />
                ) : (
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${COLORS[index] || COLORS[3]} flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto`}
                  >
                    {user.memberNick.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="text-center">
                  {/* Rank + Nick */}
                  <h3 className="font-semibold text-foreground mb-1">
                    {RANK_LABELS[index]} {user.memberNick}
                  </h3>

                  {/* Points */}
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <span className="text-yellow-400 font-bold text-lg">{user.memberPoints}</span>
                    <span className="text-muted-foreground text-sm">points</span>
                  </div>

                  {/* Member type badge */}
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs bg-accent/10 text-accent">
                    {user.memberType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
