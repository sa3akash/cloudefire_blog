import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";
import { Mail, MessageSquare, Send, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact Editorial | CloudBlog",
  description: "Get in touch with the CloudBlog editorial team.",
};

export default async function ContactPage() {
  const contactEmail = await getSetting("contactEmail", "contact@cloudblog.local");

  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary font-mono">
          <Mail className="w-3.5 h-3.5" />
          <span>Contact</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
          Get in Touch
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Have an architecture question, editorial feedback, or want to collaborate? Send us a message or reach out directly at{" "}
          <strong className="text-foreground font-mono">{contactEmail}</strong>.
        </p>
      </div>

      <div className="p-8 rounded-2xl border border-border/80 bg-card/60 shadow-xs space-y-6">
        <h2 className="font-bold text-lg font-heading tracking-tight">
          Send an Inquiry
        </h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="contactName">
                Your Name
              </label>
              <Input id="contactName" placeholder="Alex Smith" required className="h-9 text-xs" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="contactEmail">
                Email Address
              </label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="alex@example.com"
                required
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="contactSubject">
              Subject
            </label>
            <Input id="contactSubject" placeholder="Article feedback / Architecture inquiry" required className="h-9 text-xs" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="contactMessage">
              Message
            </label>
            <Textarea
              id="contactMessage"
              placeholder="Write your message here..."
              rows={5}
              required
              className="text-xs resize-none"
            />
          </div>

          <Button type="button" className="gap-2 text-xs">
            <Send className="w-3.5 h-3.5" />
            <span>Send Message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
