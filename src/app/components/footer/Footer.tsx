import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-border">
      {/* Newsletter section */}
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
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-lg font-bold text-white">Gadjets</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Your trusted source for premium gadgets and smart devices.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-card hover:bg-accent/20 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4 text-muted-foreground hover:text-accent" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-card hover:bg-accent/20 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4 text-muted-foreground hover:text-accent" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-card hover:bg-accent/20 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4 text-muted-foreground hover:text-accent" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-card hover:bg-accent/20 flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4 text-muted-foreground hover:text-accent" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/"><a className="text-muted-foreground hover:text-foreground transition-colors text-sm">Home</a></Link></li>
              <li><Link href="/products"><a className="text-muted-foreground hover:text-foreground transition-colors text-sm">Products</a></Link></li>
              <li><Link href="/orders"><a className="text-muted-foreground hover:text-foreground transition-colors text-sm">Orders</a></Link></li>
              <li><Link href="/help"><a className="text-muted-foreground hover:text-foreground transition-colors text-sm">Help</a></Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/help"><a className="text-muted-foreground hover:text-foreground transition-colors text-sm">Contact Us</a></Link></li>
              <li><Link href="/help"><a className="text-muted-foreground hover:text-foreground transition-colors text-sm">FAQ</a></Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Shipping Info</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Returns</a></li>
              <li><Link href="/orders"><a className="text-muted-foreground hover:text-foreground transition-colors text-sm">Track Order</a></Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Press</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Partners</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Sustainability</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">support@gizzy.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">123 Tech Street, Silicon Valley, CA 94025</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
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
