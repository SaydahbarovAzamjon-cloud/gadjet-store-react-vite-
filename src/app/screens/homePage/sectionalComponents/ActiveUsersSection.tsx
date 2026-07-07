import { useEffect, useState } from "react";
import { Trophy, MapPin, FileText } from "lucide-react";
import apiService from "@/lib/apiService";
import { getImageUrl } from "@/lib/getImageUrl";
import { useAuth } from "@/app/components/auth/AuthContext";

// Backend /member/top-users dan kelgan tip
interface TopUser {
  _id: string;
  memberNick: string;
  memberPoints: number;
  memberImage?: string;
  memberType: string;
  memberAddress?: string;
  memberDesc?: string;
}

// Avatar ranglari — index bo'yicha
const COLORS = [
  "from-yellow-400 to-orange-500",
  "from-slate-400 to-slate-500",
  "from-amber-600 to-amber-700",
  "from-blue-500 to-purple-600",
];

const RANK_LABELS = ["🥇", "🥈", "🥉", ""];

export default function ActiveUsersSection() {
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTopUsers = () => {
    apiService
      .get("/member/top-users")
      .then(({ data }) => setTopUsers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // Birinchi yuklash
  useEffect(() => {
    fetchTopUsers();
  }, []);

  // FIX: user profili o'zgarganda (verifyAuth keyin) listni yangilash.
  // user._id, memberNick, memberAddress, memberDesc, memberImage o'zgarsa qayta fetch.
  useEffect(() => {
    if (!user) return;

    setTopUsers((prev) => {
      // Agar joriy user top listda bo'lsa — uning ma'lumotlarini Redux dan yangilaymiz.
      // Bu backend refetch kutmasdan UI ni darhol yangilaydi.
      const found = prev.find((u) => u._id === user._id);
      if (!found) return prev; // user listda yo'q — o'zgartirish kerak emas

      return prev.map((u) =>
        u._id === user._id
          ? {
              ...u,
              memberNick:    user.memberNick    ?? u.memberNick,
              memberImage:   user.memberImage   ?? u.memberImage,
              memberAddress: user.memberAddress ?? u.memberAddress,
              memberDesc:    user.memberDesc    ?? u.memberDesc,
            }
          : u
      );
    });
  }, [
    user?._id,
    user?.memberNick,
    user?.memberAddress,
    user?.memberDesc,
    user?.memberImage,
  ]);

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
              <div key={i} className="bg-card rounded-xl p-6 border border-border animate-pulse h-52" />
            ))}
          </div>
        ) : topUsers.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Hozircha top user yo'q</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topUsers.map((topUser, index) => (
              <div
                key={topUser._id}
                className="bg-card rounded-xl p-6 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 flex flex-col"
              >
                {/* Avatar */}
                {topUser.memberImage ? (
                  <img
                    src={getImageUrl(topUser.memberImage)}
                    alt={topUser.memberNick}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                  />
                ) : (
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${COLORS[index] || COLORS[3]} flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto`}
                  >
                    {topUser.memberNick.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="text-center flex-1 flex flex-col">
                  {/* Rank + Nick */}
                  <h3 className="font-semibold text-foreground mb-1">
                    {RANK_LABELS[index]} {topUser.memberNick}
                  </h3>

                  {/* Points */}
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-yellow-400 font-bold text-lg">{topUser.memberPoints}</span>
                    <span className="text-muted-foreground text-sm">points</span>
                  </div>

                  {/* Member type badge */}
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs bg-accent/10 text-accent">
                    {topUser.memberType}
                  </span>

                  {/* Location + Description — faqat mavjud bo'lsa */}
                  {(topUser.memberAddress || topUser.memberDesc) && (
                    <div className="border-t border-border mt-3 pt-3 space-y-2 text-left">
                      {topUser.memberAddress && (
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-muted-foreground leading-tight line-clamp-1">
                            {topUser.memberAddress}
                          </span>
                        </div>
                      )}
                      {topUser.memberDesc && (
                        <div className="flex items-start gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-muted-foreground leading-tight line-clamp-2">
                            {topUser.memberDesc}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}