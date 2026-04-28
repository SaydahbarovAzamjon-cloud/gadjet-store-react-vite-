import Header from "@/app/components/headers/Header";
import Footer from "@/app/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { User, MapPin, CreditCard, LogOut, Upload, Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/components/auth/AuthContext";
import apiService from "@/lib/apiService";
import { useAppDispatch } from "@/hooks/redux";
import { verifyAuth } from "@/store/slices/authSlice";

export default function MyPage() {
  const { user, logout } = useAuth();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"profile" | "address" | "payment">("profile");
  const [profileImage, setProfileImage] = useState<string>(
    user?.memberImage || "https://d2xsxph8kpxj0f.cloudfront.net/310519663464643074/QaGTRRsJqyabPS7Ai9zqHt/hero-smartwatch-m9S5b4DMyyxYQXkrVX87u7.webp"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nick, setNick] = useState(user?.memberNick || "");
  const [phone, setPhone] = useState(user?.memberPhone || "");
  const [address, setAddress] = useState(user?.memberAddress || "");
  const [desc, setDesc] = useState(user?.memberDesc || "");

  // user Redux dan async keladi — kelganda inputlarni to'ldirish
  useEffect(() => {
    if (user) {
      setNick(user.memberNick || "");
      setPhone(user.memberPhone || "");
      setAddress(user.memberAddress || "");
      setDesc(user.memberDesc || "");
      if (user.memberImage) setProfileImage(user.memberImage);
    }
  }, [user]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ text: string; success: boolean } | null>(null);

  // Tanlangan file ni state da saqlash (preview + upload uchun)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file); // haqiqiy file — upload uchun
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string); // preview
      reader.readAsDataURL(file);
    }
  };

  // Profile save — FormData bilan (image upload uchun multipart/form-data kerak)
  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveMsg(null);

      const formData = new FormData();
      formData.append("memberNick", nick);
      formData.append("memberPhone", phone);
      formData.append("memberAddress", address);
      formData.append("memberDesc", desc);
      // Agar yangi rasm tanlangan bo'lsa qo'shish
      if (selectedFile) formData.append("memberImage", selectedFile);

      await apiService.post("/member/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Refresh Redux state from server (source of truth)
      await dispatch(verifyAuth());
      setSaveMsg({ text: "✅ Profile saved successfully!", success: true });
      setSelectedFile(null); // reset
    } catch (err: any) {
      setSaveMsg({ text: err.response?.data?.message || "Failed to save profile. Please try again.", success: false });
    } finally {
      setSaving(false);
    }
  };

  // Logout — AuthContext confirm dialog ochadi (navigate kerak emas, dialog o'zi boshqaradi)
  const handleLogout = () => {
    logout(); // confirm dialog ochadi
  };

  // Hardcoded address/payment — backend order endpoint yo'q hozircha
  const addresses = [
    { id: 1, type: "Home", name: user?.memberNick, street: user?.memberAddress || "—", isDefault: true },
  ];
  const paymentMethods = [
    { id: 1, type: "Credit Card", cardNumber: "**** **** **** 4242", expiry: "12/25", isDefault: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
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
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut className="w-5 h-5" /><span className="font-medium">Logout</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-8">Profile Information</h2>
                  <div className="space-y-8">
                    {/* Profile Picture */}
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

                    {/* Form Fields — real data */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-2">Username (Nick)</label>
                      <input type="text" value={nick} onChange={(e) => setNick(e.target.value)}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-2">Phone</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-2">Address</label>
                      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-2">About</label>
                      <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                    </div>

                    {saveMsg && (
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium ${
                        saveMsg.success
                          ? "bg-green-500/10 border-green-500 text-green-500"
                          : "bg-red-500/10 border-red-500 text-red-500"
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

              {/* Address Tab */}
              {activeTab === "address" && (
                <div className="space-y-6">
                  {addresses.map((address) => (
                    <div key={address.id} className="bg-card rounded-lg border border-border p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{address.type}</h3>
                          {address.isDefault && <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded mt-1 inline-block">Default</span>}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-border">Edit</Button>
                          <Button size="sm" variant="outline" className="border-border text-destructive">Delete</Button>
                        </div>
                      </div>
                      <p className="text-foreground">{address.name}</p>
                      <p className="text-muted-foreground">{address.street}</p>
                    </div>
                  ))}
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    Add New Address
                  </Button>
                </div>
              )}

              {/* Payment Tab */}
              {activeTab === "payment" && (
                <div className="space-y-6">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="bg-card rounded-lg border border-border p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{method.type}</h3>
                          {method.isDefault && <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded mt-1 inline-block">Default</span>}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-border">Edit</Button>
                          <Button size="sm" variant="outline" className="border-border text-destructive">Delete</Button>
                        </div>
                      </div>
                      <p className="text-foreground font-mono">{method.cardNumber}</p>
                      <p className="text-muted-foreground text-sm mt-2">Expires: {method.expiry}</p>
                    </div>
                  ))}
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    Add Payment Method
                  </Button>
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
