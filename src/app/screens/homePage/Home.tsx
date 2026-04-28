import { useAuth } from "@/app/components/auth/AuthContext";
import Header from "@/app/components/headers/Header";
import HeroSection from "@/app/screens/homePage/sectionalComponents/HeroSection";
import PopularGadgetsSection from "@/app/screens/homePage/sectionalComponents/PopularGadgetsSection";
import NewGadgetsSection from "@/app/screens/homePage/sectionalComponents/NewGadgetsSection";
import ActiveUsersSection from "@/app/screens/homePage/sectionalComponents/ActiveUsersSection";
import EventsSection from "@/app/screens/homePage/sectionalComponents/EventsSection";
import VideoShowcase from "@/app/screens/homePage/sectionalComponents/VideoShowcase";
import Footer from "@/app/components/footer/Footer";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <PopularGadgetsSection />
        <NewGadgetsSection />
        <ActiveUsersSection />
        <EventsSection />
        <VideoShowcase />
      </main>
      <Footer />
    </div>
  );
}
