import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import GeminiInfo from "@/components/gemini-info";
import UserTestimonials from "@/components/user-testimonials";
import AIAssistantInfo from "@/components/ai-assistant-info";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <GeminiInfo />
      <AIAssistantInfo />
      <UserTestimonials />
    </div>
  );
}
