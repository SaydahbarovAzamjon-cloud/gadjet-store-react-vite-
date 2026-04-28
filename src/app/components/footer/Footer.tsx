import { Instagram, Linkedin, Mail, Phone, MapPin, Send } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-border">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">
              Subscribe to our Newsletter
            </h3>
            <p className="text-muted-foreground mb-6">
              Get the latest updates on new products and exclusive offers
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">

          {/* Brand + Socials */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-lg font-bold text-white">Gadjets</span>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Your trusted source for premium gadgets and smart devices.
            </p>

            {/* Social icons — Instagram, LinkedIn, Telegram */}
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/iamsaidakbarov__/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-card hover:bg-pink-500/20 border border-border hover:border-pink-500 flex items-center justify-center transition-all group"
                title="Instagram"
              >
                <Instagram className="w-4 h-4 text-muted-foreground group-hover:text-pink-400 transition-colors" />
              </a>
              <a
                href="https://www.linkedin.com/in/azamjon-saydahbarov-a55647406/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-card hover:bg-blue-500/20 border border-border hover:border-blue-500 flex items-center justify-center transition-all group"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
              </a>
              <a
                href="https://t.me/iamsaidakbarov"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-card hover:bg-sky-500/20 border border-border hover:border-sky-500 flex items-center justify-center transition-all group"
                title="Telegram"
              >
                <Send className="w-4 h-4 text-muted-foreground group-hover:text-sky-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links — hammasi ishlaydi */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Help
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.linkedin.com/in/azamjon-saydahbarov-a55647406/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/azamjon-saydahbarov-a55647406/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/iamsaidakbarov__/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Press
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/iamsaidakbarov"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Partners
                </a>
              </li>
            </ul>
          </div>

          {/* Contact — real ma'lumotlar */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <a
                  href="tel:01083494111"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  010-8349-4111
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:saydahbarovazamjon@gmail.com"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors break-all"
                >
                  saydahbarovazamjon@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  Busan, South Korea
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © 2026 Gadjets. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
