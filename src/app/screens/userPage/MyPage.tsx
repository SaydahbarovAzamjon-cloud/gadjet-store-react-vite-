import Header from "@/app/components/headers/Header";
import Footer from "@/app/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { User, MapPin, CreditCard, LogOut, Upload, Camera, Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/components/auth/AuthContext";
import apiService from "@/lib/apiService";
import { useAppDispatch } from "@/hooks/redux";
import { verifyAuth } from "@/store/slices/authSlice";

// ─── Payment card tipi (backend yo'q, local state da saqlanadi) ──────────────
interface PaymentCard {
  id: number;
  type: string;
  cardNumber: string;   // "4242" — oxirgi 4 ta raqam
  expiry: string;       // "MM/YY" format
  isDefault: boolean;
}

export default function MyPage() {
  const { user, logout } = useAuth();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"profile" | "address" | "payment">("profile");

  // ── Profile state ────────────────────────────────────────────────────────────
  const [profileImage, setProfileImage] = useState<string>(
    user?.memberImage || "https://d2xsxph8kpxj0f.cloudfront.net/310519663464643074/QaGTRRsJqyabPS7Ai9zqHt/hero-smartwatch-m9S5b4DMyyxYQXkrVX87u7.webp"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nick, setNick]       = useState(user?.memberNick    || "");
  const [phone, setPhone]     = useState(user?.memberPhone   || "");
  const [address, setAddress] = useState(user?.memberAddress || "");
  const [desc, setDesc]       = useState(user?.memberDesc    || "");
  const [saving, setSaving]   = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // user Redux dan kelganda inputlarni to'ldirish
  useEffect(() => {
    if (user) {
      setNick(user.memberNick    || "");
      setPhone(user.memberPhone  || "");
      setAddress(user.memberAddress || "");
      setDesc(user.memberDesc    || "");
      if (user.memberImage) setProfileImage(user.memberImage);
    }
  }, [user]);

  // ── Address edit state ───────────────────────────────────────────────────────
  // isEditingAddress: inline edit formi ochiq/yopiq
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  // Editda ko'rsatiladigan vaqtinchalik qiymat
  const [editAddressValue, setEditAddressValue] = useState("");
  const [addressSaving, setAddressSaving]       = useState(false);
  const [addressMsg, setAddressMsg]             = useState<{ text: string; success: boolean } | null>(null);

  // ── Payment state (local, backend yo'q) ─────────────────────────────────────
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([
    { id: 1, type: "Credit Card", cardNumber: "4242", expiry: "12/25", isDefault: true },
  ]);
  // Qaysi karta edit modeda
  const [editingCardId, setEditingCardId]       = useState<number | null>(null);
  // Edit formidagi vaqtinchalik qiymatlar
  const [editCardNumber, setEditCardNumber]     = useState("");
  const [editCardExpiry, setEditCardExpiry]     = useState("");
  // Yangi karta qo'shish formasi
  const [showAddCard, setShowAddCard]           = useState(false);
  const [newCardNumber, setNewCardNumber]       = useState("");
  const [newCardExpiry, setNewCardExpiry]       = useState("");

  // ── Profile handlers ─────────────────────────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Profile ma'lumotlarini saqlash (/member/update)
  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveMsg(null);
      const formData = new FormData();
      formData.append("memberNick", nick);
      formData.append("memberPhone", phone);
      formData.append("memberAddress", address);
      formData.append("memberDesc", desc);
      if (selectedFile) formData.append("memberImage", selectedFile);

      await apiService.post("/member/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await dispatch(verifyAuth()); // Redux ni server ma'lumotidan yangilash
      setSaveMsg({ text: "✅ Profile saved successfully!", success: true });
      setSelectedFile(null);
    } catch (err: any) {
      setSaveMsg({ text: err.response?.data?.message || "Failed to save profile.", success: false });
    } finally {
      setSaving(false);
    }
  };

  // ── Address handlers ─────────────────────────────────────────────────────────

  // Edit tugmasi bosilganda: mavjud manzilni editga yuklash
  const handleAddressEditOpen = () => {
    setEditAddressValue(user?.memberAddress || "");
    setAddressMsg(null);
    setIsEditingAddress(true);
  };

  // Manzilni saqlash — /member/update orqali real API ga yoziladi
  const handleAddressSave = async () => {
    try {
      setAddressSaving(true);
      setAddressMsg(null);

      const formData = new FormData();
      // Faqat address o'zgaradi, qolganlarini saqlab qo'yamiz
      formData.append("memberNick",    user?.memberNick    || "");
      formData.append("memberPhone",   user?.memberPhone   || "");
      formData.append("memberAddress", editAddressValue.trim());
      formData.append("memberDesc",    user?.memberDesc    || "");

      await apiService.post("/member/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Redux refresh — UI darhol yangilanadi
      await dispatch(verifyAuth());
      setAddressMsg({ text: "✅ Address updated!", success: true });
      setIsEditingAddress(false);
    } catch (err: any) {
      setAddressMsg({ text: err.response?.data?.message || "Failed to update address.", success: false });
    } finally {
      setAddressSaving(false);
    }
  };

  // ── Payment handlers ─────────────────────────────────────────────────────────

  // MM/YY auto-format: raqam kiritilganda "/" avtomatik qo'shiladi
  const formatExpiry = (value: string) => {
    // Faqat raqamlarni qoldiramiz
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    // MM/YY formatiga o'tkazamiz
    return digits.slice(0, 2) + "/" + digits.slice(2, 4);
  };

  // Karta raqamini formatlash — faqat oxirgi 4 ta raqam saqlanadi
  const formatCardLast4 = (value: string) => {
    return value.replace(/\D/g, "").slice(-4);
  };

  // Edit boshlash
  const handleCardEditOpen = (card: PaymentCard) => {
    setEditingCardId(card.id);
    setEditCardNumber(card.cardNumber);
    setEditCardExpiry(card.expiry);
  };

  // Edit saqlash
  const handleCardSave = (id: number) => {
    const last4 = formatCardLast4(editCardNumber);
    if (last4.length < 4) return; // validation
    if (!editCardExpiry.match(/^\d{2}\/\d{2}$/)) return;

    setPaymentCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, cardNumber: last4, expiry: editCardExpiry }
          : c
      )
    );
    setEditingCardId(null);
  };

  // Kartani o'chirish
  const handleCardDelete = (id: number) => {
    setPaymentCards((prev) => prev.filter((c) => c.id !== id));
  };

  // Yangi karta qo'shish
  const handleAddCard = () => {
    const last4 = formatCardLast4(newCardNumber);
    if (last4.length < 4 || !newCardExpiry.match(/^\d{2}\/\d{2}$/)) return;

    const newCard: PaymentCard = {
      id: Date.now(),
      type: "Credit Card",
      cardNumber: last4,
      expiry: newCardExpiry,
      isDefault: paymentCards.length === 0, // birinchi karta default
    };
    setPaymentCards((prev) => [...prev, newCard]);
    setNewCardNumber("");
    setNewCardExpiry("");
    setShowAddCard(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Breadcrumb */}
        <div className="container py-6 border-b border-border">
          <div className="flex items-center gap-2 text-sm">
            <a href="/" className="text-muted-foreground hover:text-foreground">Home</a>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">My Profile</span>
          </div>
        </div>

        <div className="container py-12">
          <h1 className="text-3xl font-bold text-foreground mb-8">My Account</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                <button onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "profile" ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-background"}`}>
                  <User className="w-5 h-5" /><span className="font-medium">Profile</span>
                </button>
                <button onClick={() => setActiveTab("address")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "address" ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-background"}`}>
                  <MapPin className="w-5 h-5" /><span className="font-medium">Addresses</span>
                </button>
                <button onClick={() => setActiveTab("payment")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "payment" ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-background"}`}>
                  <CreditCard className="w-5 h-5" /><span className="font-medium">Payment</span>
                </button>
                <button onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut className="w-5 h-5" /><span className="font-medium">Logout</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">

              {/* ══ Profile Tab ══ */}
              {activeTab === "profile" && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-8">Profile Information</h2>
                  <div className="space-y-8">
                    {/* Profile rasm */}
                    <div className="flex flex-col items-center gap-6 pb-8 border-b border-border">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-accent shadow-lg">
                          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <button onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-full shadow-lg transition-all group-hover:scale-110">
                          <Camera className="w-5 h-5" />
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-foreground">{user?.memberNick}</h3>
                        <p className="text-sm text-muted-foreground">{user?.memberPhone}</p>
                        <button onClick={() => fileInputRef.current?.click()}
                          className="mt-3 flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors mx-auto">
                          <Upload className="w-4 h-4" />Change Picture
                        </button>
                      </div>
                    </div>

                    {/* Form fields */}
                    {[
                      { label: "Username (Nick)", value: nick, setter: setNick, type: "text" },
                      { label: "Phone", value: phone, setter: setPhone, type: "tel" },
                      { label: "Address", value: address, setter: setAddress, type: "text" },
                      { label: "About", value: desc, setter: setDesc, type: "text" },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="text-sm font-medium text-muted-foreground block mb-2">{field.label}</label>
                        <input
                          type={field.type}
                          value={field.value}
                          onChange={(e) => field.setter(e.target.value)}
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                    ))}

                    {saveMsg && (
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium ${
                        saveMsg.success ? "bg-green-500/10 border-green-500 text-green-500" : "bg-red-500/10 border-red-500 text-red-500"
                      }`}>
                        {saveMsg.text}
                      </div>
                    )}

                    <div className="pt-4 border-t border-border">
                      <Button onClick={handleSave} disabled={saving}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* ══ Address Tab ══ */}
              {activeTab === "address" && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border p-6">
                    {/* Sarlavha + Edit tugmasi */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Home</h3>
                        {/* "Default" o'rniga real holat ko'rsatiladi */}
                        {user?.memberAddress ? (
                          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded mt-1 inline-block">
                            Default
                          </span>
                        ) : (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded mt-1 inline-block">
                            No address set
                          </span>
                        )}
                      </div>

                      {/* Edit mode ochiq bo'lmasa tugmalarni ko'rsat */}
                      {!isEditingAddress && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-border gap-1"
                            onClick={handleAddressEditOpen}
                          >
                            <Pencil className="w-3 h-3" />Edit
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Manzil ko'rish / edit mode */}
                    {isEditingAddress ? (
                      /* ── Edit forma ── */
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">Name</label>
                          <p className="text-foreground font-medium text-sm">{user?.memberNick}</p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">Address</label>
                          <input
                            type="text"
                            value={editAddressValue}
                            onChange={(e) => setEditAddressValue(e.target.value)}
                            placeholder="Enter your address..."
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>

                        {addressMsg && (
                          <p className={`text-xs font-medium ${addressMsg.success ? "text-green-500" : "text-red-500"}`}>
                            {addressMsg.text}
                          </p>
                        )}

                        {/* Saqlash / Bekor qilish */}
                        <div className="flex gap-2 pt-1">
                          <Button
                            size="sm"
                            onClick={handleAddressSave}
                            disabled={addressSaving}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white gap-1"
                          >
                            <Check className="w-3 h-3" />
                            {addressSaving ? "Saving..." : "Save"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-border gap-1"
                            onClick={() => { setIsEditingAddress(false); setAddressMsg(null); }}
                          >
                            <X className="w-3 h-3" />Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* ── Ko'rish rejimi ── */
                      <div>
                        <p className="text-foreground font-medium">{user?.memberNick}</p>
                        {user?.memberAddress ? (
                          <p className="text-muted-foreground">{user.memberAddress}</p>
                        ) : (
                          /* Manzil yo'q bo'lsa — aniq xabar */
                          <p className="text-muted-foreground italic text-sm">
                            No address added yet. Click Edit to add one.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Add New Address tugmasi */}
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white gap-2"
                    onClick={handleAddressEditOpen}
                  >
                    <Plus className="w-4 h-4" />
                    {user?.memberAddress ? "Update Address" : "Add New Address"}
                  </Button>
                </div>
              )}

              {/* ══ Payment Tab ══ */}
              {activeTab === "payment" && (
                <div className="space-y-6">
                  {paymentCards.length === 0 && !showAddCard && (
                    <div className="bg-card rounded-lg border border-border p-8 text-center">
                      <CreditCard className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">No payment methods added yet.</p>
                    </div>
                  )}

                  {paymentCards.map((card) => (
                    <div key={card.id} className="bg-card rounded-lg border border-border p-6">
                      {editingCardId === card.id ? (
                        /* ── Karta edit forma ── */
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-foreground mb-2">Edit Card</h3>

                          <div>
                            <label className="text-xs text-muted-foreground block mb-1">
                              Last 4 digits of card number
                            </label>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground font-mono text-sm">**** **** ****</span>
                              <input
                                type="text"
                                value={editCardNumber}
                                onChange={(e) => setEditCardNumber(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                maxLength={4}
                                placeholder="4242"
                                className="w-20 px-3 py-2 bg-background border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs text-muted-foreground block mb-1">
                              Expiry Date (MM/YY)
                            </label>
                            <input
                              type="text"
                              value={editCardExpiry}
                              onChange={(e) => setEditCardExpiry(formatExpiry(e.target.value))}
                              maxLength={5}
                              placeholder="MM/YY"
                              className="w-28 px-3 py-2 bg-background border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Format: MM/YY (e.g. 12/27)</p>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <Button
                              size="sm"
                              onClick={() => handleCardSave(card.id)}
                              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white gap-1"
                            >
                              <Check className="w-3 h-3" />Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-border gap-1"
                              onClick={() => setEditingCardId(null)}
                            >
                              <X className="w-3 h-3" />Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        /* ── Karta ko'rish ── */
                        <>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">{card.type}</h3>
                              {card.isDefault && (
                                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded mt-1 inline-block">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-border gap-1"
                                onClick={() => handleCardEditOpen(card)}
                              >
                                <Pencil className="w-3 h-3" />Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-border text-destructive gap-1"
                                onClick={() => handleCardDelete(card.id)}
                              >
                                <Trash2 className="w-3 h-3" />Delete
                              </Button>
                            </div>
                          </div>

                          {/* Karta raqami — masked */}
                          <p className="text-foreground font-mono tracking-widest text-lg">
                            **** **** **** {card.cardNumber}
                          </p>

                          {/* Muddati — to'g'ri format */}
                          <p className="text-muted-foreground text-sm mt-2">
                            Expires: {card.expiry}
                          </p>
                        </>
                      )}
                    </div>
                  ))}

                  {/* ── Yangi karta qo'shish forma ── */}
                  {showAddCard && (
                    <div className="bg-card rounded-lg border border-accent/30 p-6 space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Add New Card</h3>

                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">
                          Last 4 digits of card number
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-mono text-sm">**** **** ****</span>
                          <input
                            type="text"
                            value={newCardNumber}
                            onChange={(e) => setNewCardNumber(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            maxLength={4}
                            placeholder="4242"
                            className="w-20 px-3 py-2 bg-background border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">
                          Expiry Date (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={newCardExpiry}
                          onChange={(e) => setNewCardExpiry(formatExpiry(e.target.value))}
                          maxLength={5}
                          placeholder="MM/YY"
                          className="w-28 px-3 py-2 bg-background border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Format: MM/YY (e.g. 12/27)</p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleAddCard}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white gap-1"
                        >
                          <Plus className="w-3 h-3" />Add Card
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-border gap-1"
                          onClick={() => { setShowAddCard(false); setNewCardNumber(""); setNewCardExpiry(""); }}
                        >
                          <X className="w-3 h-3" />Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Add Payment Method tugmasi */}
                  {!showAddCard && (
                    <Button
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white gap-2"
                      onClick={() => setShowAddCard(true)}
                    >
                      <Plus className="w-4 h-4" />Add Payment Method
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
