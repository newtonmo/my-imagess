
import { ArrowDownRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center pt-16 md:pt-0">
      <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="order-2 md:order-1">
          <h1 className="heading-xl mb-4 animate-fade-in">
            Hi, I'm{" "}
            <span className="text-primary">Mohammed Al-Keem</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in [animation-delay:200ms]">
            A full-stack developer and designer passionate about building modern web solutions
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in [animation-delay:400ms]">
            <a href="#portfolio" className="btn-primary">
              View My Work
            </a>
            <a href="#contact" className="btn-outline">
              Hire Me
            </a>
          </div>
          <div className="mt-16 hidden md:block">
            <a
              href="#news"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all group"
            >
              <span>Scroll down</span>
              <ArrowDownRight className="h-4 w-4 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
        <div className="flex justify-center md:justify-end order-1 md:order-2">
          <div className="w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-primary/20 animate-fade-in">
            <img
              src="https://media.licdn.com/dms/image/v2/D4E03AQHGHdVcktLPxw/profile-displayphoto-shrink_800_800/B4EZZPLpejHUAc-/0/1745085179726?e=1750896000&v=beta&t=NLUK3Wc17P6CNpCKWH5CBZ7jKGmwlHA_gUNuCS_kNxE"
              alt="Mohammed Al-Keem"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
