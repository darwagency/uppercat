import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SampleSection from "@/components/SampleSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      <Header />
      <main className="flex-1 flex flex-col">
        <Hero />
        <SampleSection />
      </main>
    </div>
  );
}
