
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Trophy } from "lucide-react";

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Set loaded after a short delay for animation effect
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-cricket-blue to-cricket-darkBlue text-white">
      {/* Animated cricket ball elements */}
      <div className="absolute top-1/4 left-10 w-12 h-12 rounded-full bg-cricket-red opacity-20 animate-bounce-slow" style={{ animationDelay: "0.5s" }}></div>
      <div className="absolute bottom-1/3 right-20 w-8 h-8 rounded-full bg-cricket-red opacity-30 animate-bounce-slow" style={{ animationDelay: "1.2s" }}></div>
      <div className="absolute top-2/3 left-1/4 w-6 h-6 rounded-full bg-cricket-red opacity-25 animate-bounce-slow" style={{ animationDelay: "0.8s" }}></div>
      
      {/* Cricket bat silhouette */}
      <div className="absolute bottom-0 right-10 w-20 h-60 opacity-10 animate-bat-swing">
        <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.05,17.05a1,1,0,0,0,1.41,0l9.9-9.9,4.24,4.24a1,1,0,0,0,1.41,0l3.54-3.54a1,1,0,0,0,0-1.41L19.2,2.1a1,1,0,0,0-1.41,0L14.25,5.64a1,1,0,0,0,0,1.41l4.24,4.24-9.9,9.9A1,1,0,0,0,9.19,20a1,1,0,0,0,1.41,0L17.9,12.7l-4.24-4.24,2.12-2.12,4.24,4.24-2.12,2.12-1.41-1.41L9.19,18.46a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l7.07-7.07a1,1,0,0,0,0-1.41L13.5,7.14,18.46,2.18,21.83,5.54,18.46,8.9l-4.24-4.24L8.9,10a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l5.31-5.31,2.83,2.83L16.6,10.88,13.77,8.05l-1.42,1.41,4.24,4.24,1.42-1.41L15.18,9.46l2.12-2.12-2.83-2.83,2.12-2.12,2.83,2.83L17.31,7.34l4.24,4.24a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41L18.78,6,21.6,3.15,22.31,2.44a2,2,0,0,0,0-2.83,2,2,0,0,0-2.83,0l-.71.71L15.93,3.15,11.7,7.38,3.05,16a1,1,0,0,0,0,1.41A1,1,0,0,0,4.46,18l7.07-7.07-1.41-1.41L3.05,16.64A1,1,0,0,0,3.05,17.05Z" />
        </svg>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <img 
            src="/lovable-uploads/71a86eef-5979-40e7-b83d-94104f319e76.png" 
            alt="Global Cric Info" 
            className={`w-32 h-32 mx-auto mb-6 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
            style={{ animationDelay: "0.1s" }}
          />
          
          <h1 
            className={`text-4xl md:text-6xl font-bold leading-tight ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
            style={{ animationDelay: "0.3s" }}
          >
            Your Ultimate Source for Cricket News
          </h1>
          
          <p 
            className={`text-lg md:text-xl text-gray-200 max-w-2xl mx-auto ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
            style={{ animationDelay: "0.5s" }}
          >
            Stay updated with the latest cricket news, match updates, player profiles, and expert analysis from around the world.
          </p>
          
          <div 
            className={`flex flex-col sm:flex-row gap-4 justify-center mt-8 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
            style={{ animationDelay: "0.7s" }}
          >
            <Button asChild size="lg" className="bg-cricket-red hover:bg-cricket-red/90">
              <Link to="/news">
                Latest News
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/20">
              <a href="#featured">
                Featured Stories
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Wave SVG at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="#ffffff">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
        </svg>
      </div>
    </section>
  );
}

export default HeroSection;
