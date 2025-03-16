
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
  }, []);
  
  return (
    <section className="hero-section min-h-[70vh] flex items-center relative overflow-hidden">
      {/* Background animated pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-cricket-navy bg-opacity-80 z-0"></div>
        
        <div className="absolute w-full h-full opacity-20">
          <div className="cricket-ball animate-bounce-light absolute h-16 w-16 rounded-full bg-gradient-to-r from-red-600 to-red-500 top-[20%] right-[10%]"></div>
          <div className="cricket-ball animate-bounce-light absolute h-10 w-10 rounded-full bg-gradient-to-r from-red-600 to-red-500 top-[60%] left-[15%]" style={{ animationDelay: "1s" }}></div>
          <div className="cricket-ball animate-bounce-light absolute h-8 w-8 rounded-full bg-gradient-to-r from-red-600 to-red-500 top-[30%] left-[40%]" style={{ animationDelay: "0.5s" }}></div>
          <div className="cricket-ball animate-bounce-light absolute h-20 w-20 rounded-full bg-gradient-to-r from-red-600 to-red-500 top-[70%] right-[30%]" style={{ animationDelay: "1.5s" }}></div>
        </div>
        
        {/* Cricket stumps and bats pattern */}
        <div className="absolute inset-0 bg-cricket-pattern bg-repeat opacity-5 z-0"></div>
        
        {/* Wave effect at bottom */}
        <div className="hero-waves">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path 
              fill="#f8fafc" 
              fillOpacity="1" 
              d="M0,256L48,245.3C96,235,192,213,288,202.7C384,192,480,192,576,208C672,224,768,256,864,250.7C960,245,1056,203,1152,186.7C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className={`text-white space-y-6 transition-all duration-700 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="inline-block bg-gradient-to-r from-cricket-accent to-cricket-lightBlue bg-opacity-80 rounded-full px-3 py-1 text-sm font-medium backdrop-blur-sm">
              Breaking Cricket News
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Your Ultimate Source for Cricket Updates
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-lg">
              Stay informed with the latest cricket news, match updates, player profiles, and in-depth analysis from around the world.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button className="bg-cricket-accent hover:bg-cricket-accent/90 text-white rounded-full px-6 py-2">
                Live Scores
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-6 py-2">
                Latest News
              </Button>
            </div>
          </div>
          
          <div className={`transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative w-full max-w-md mx-auto">
              {/* Circular logo highlight */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cricket-accent to-cricket-lightBlue opacity-20 blur-2xl animate-pulse-subtle"></div>
              
              {/* Logo */}
              <div className="relative shine">
                <img 
                  src="/lovable-uploads/6b9bd336-611b-4538-abc8-ae02d6d58334.png" 
                  alt="Global Cric Info" 
                  className="w-full h-auto drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
