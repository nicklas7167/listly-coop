import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Globe2 } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto text-center space-y-4 md:space-y-8 animate-fade-in">
      <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-300% animate-gradient">
        Listify
      </h1>
      <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
        The smart way to manage grocery shopping with family and friends.
        Never forget items or buy duplicates again!
      </p>

      {/* Language Support Banner */}
      <div className="inline-flex items-center gap-2 md:gap-3 bg-white/80 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-sm border border-gray-100">
        <Globe2 className="w-3 h-3 md:w-4 md:h-4 text-primary" />
        <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm overflow-x-auto no-scrollbar">
          <span className="whitespace-nowrap">🇬🇧 English</span>
          <span className="text-gray-300">•</span>
          <span className="whitespace-nowrap">🇪🇸 Español</span>
          <span className="text-gray-300">•</span>
          <span className="whitespace-nowrap">🇩🇰 Dansk</span>
        </div>
      </div>

      {/* CTA Button */}
      <Button 
        onClick={onGetStarted}
        size="lg"
        className="bg-primary hover:bg-primary/90 text-white px-8 py-8 md:px-8 md:py-7 text-lg md:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group mt-6 md:mt-8 w-[80%] md:w-auto min-h-[4rem] md:min-h-0"
      >
        Get Started
        <ArrowDown className="ml-2 w-5 h-5 md:w-5 md:h-5 group-hover:translate-y-1 transition-transform duration-300" />
      </Button>
    </div>
  );
};