import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills"; // Moved up: Shows technical fit immediately
import Experience from "@/components/Experience";
import Projects from "@/components/Projects"; // High priority: Proof of work
import Highlights from "@/components/Highlights"; // Engineering mindset
import About from "@/components/About"; // Personal context & Education
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      {/* 1. Show them you have the stack they are looking for */}
      <Skills /> 
      
      {/* 2. Show them you have worked in a professional setting */}
      <Experience /> 
      
      {/* 3. Show them what you've built with those skills */}
      <Projects /> 
      
      {/* 4. Explain why you are a better choice than other freshers */}
      <Highlights /> 
      
      {/* 5. Give them the details of your background/education */}
      <About /> 
      
      <Contact />
      <Footer />
    </>
  );
}