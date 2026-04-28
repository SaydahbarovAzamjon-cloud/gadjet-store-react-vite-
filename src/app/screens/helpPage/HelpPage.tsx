import Header from "@/app/components/headers/Header";
import Footer from "@/app/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { HelpCircle, FileText, Mail, Phone } from "lucide-react";
import { useState } from "react";

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState<"faq" | "terms" | "contact">("faq");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by going to 'My Orders' section in your account. Each order has a tracking number and status updates."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Items must be in original condition with all packaging and accessories."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our support team via email at support@gadjets.com, phone at +1 (555) 123-4567, or through the contact form on this page."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, PayPal, and other digital payment methods."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Breadcrumb */}
        <div className="container py-6 border-b border-border">
          <div className="flex items-center gap-2 text-sm">
            <a href="/" className="text-muted-foreground hover:text-foreground">Home</a>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Help</span>
          </div>
        </div>

        <div className="container py-12">
          <h1 className="text-3xl font-bold text-foreground mb-8">Help & Support</h1>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border overflow-x-auto">
            {[
              { id: "faq", label: "FAQ", icon: HelpCircle },
              { id: "terms", label: "Terms & Policies", icon: FileText },
              { id: "contact", label: "Contact Us", icon: Mail }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-accent text-accent"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-card rounded-lg border border-border overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-background/50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-foreground text-left">{faq.question}</h3>
                    <span className={`text-accent transition-transform ${expandedFaq === index ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 py-4 border-t border-border bg-background/30">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Terms Tab */}
          {activeTab === "terms" && (
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Terms of Service</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Welcome to Gizzy. These terms and conditions outline the rules and regulations for the use of our website and services.
                  </p>
                  <p>
                    By accessing this website, we assume you accept these terms and conditions. Do not continue to use Gizzy if you do not agree to take all of the terms and conditions stated on this page.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mt-6">License</h3>
                  <p>
                    Unless otherwise stated, Gizzy and/or its licensors own the intellectual property rights for all material on the website. All intellectual property rights are reserved.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mt-6">User Responsibilities</h3>
                  <p>
                    You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without express written permission by Gizzy.
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Privacy Policy</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mt-6">Information We Collect</h3>
                  <p>
                    We may collect information about you in a variety of ways. The information we may collect on the site includes:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Personal Data (name, email, phone number, address)</li>
                    <li>Financial and billing information</li>
                    <li>Device information and usage data</li>
                  </ul>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Return & Refund Policy</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We want you to be completely satisfied with your purchase. If you're not happy with your order, we offer a hassle-free return process.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mt-6">Return Period</h3>
                  <p>
                    You have 30 days from the date of purchase to return any item for a full refund or exchange.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mt-6">Return Conditions</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Items must be in original condition</li>
                    <li>All packaging and accessories must be included</li>
                    <li>Items must not show signs of wear or damage</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <input
                    type="text"
                    placeholder="Subject"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <textarea
                    placeholder="Your Message"
                    rows={5}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  ></textarea>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="bg-card rounded-lg border border-border p-6">
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                      <p className="text-muted-foreground">+1 (555) 123-4567</p>
                      <p className="text-sm text-muted-foreground">Mon-Fri, 9am-6pm EST</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border border-border p-6">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Email</h3>
                    <span className="text-muted-foreground">support@gadjets.com</span>                   <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-3">Business Hours</h3>
                  <div className="space-y-2 text-muted-foreground text-sm">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                    <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
