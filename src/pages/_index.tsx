import Button from "@/components/shared/Button/Button";
import Footer from "@/components/root-domain/Footer/Footer";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Index = () => {
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="w-screen h-screen bg-radial from-neutral-800 to-neutral-900">
        <div className="h-full w-full flex flex-col justify-center cursor-default px-8 md:px-16">
          <h1 className="text-[20vw] text-neutral-200 font-mono font-bold tracking-tighter leading-[0.85] text-left select-none">
            BARTOSZ
          </h1>
          <h1 className="relative left-[50vw] text-[10vw] font-mono font-bold tracking-tighter leading-[0.85] text-left -mt-1 text-teal-400 select-none">
            JANICKI
          </h1>
        </div>
        <button
          onClick={handleScrollDown}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 animate-bounce bg-neutral-900 outline outline-black rounded-full w-8 h-8 flex justify-center items-center hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Scroll down"
          type="button"
        >
          <FontAwesomeIcon icon={faArrowDown} className="text-neutral-200" />
        </button>
      </div>

      <section
        id="about-me"
        className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950 px-8 md:px-16 py-20"
      >
        <div className="mx-auto">
          <h2 className="text-[15vw] font-mono font-bold text-neutral-200 mb-12 select-none font-(family-name:--font-family-jetbrains)">
            ABOUT
          </h2>

          <div className="flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/2 flex justify-center items-start">
              <img
                src="src\assets\images\avatar.png"
                alt="profile-picture"
                className="w-full max-w-md object-cover rounded-lg md:-translate-y-7"
              />
            </div>
            <div className="space-y-6 w-full md:w-1/3">
              <p className="text-3xl text-neutral-300">
                Hi, I'm Bartosz - a programming student and aspiring developer
                based in Poland.
              </p>
              <p className="text-xl text-neutral-400 leading-relaxed">
                My journey in tech goes beyond the classroom. I've gained
                hands-on experience through internships at{" "}
                <a href="https://gi.org.pl/" className="underline">
                  Generacja Innowacja
                </a>
                , where I learned how real-world projects come to life.
              </p>
              <p className="text-xl text-neutral-400 leading-relaxed">
                When I'm not writing code, you can find me exploring 3D modeling
                in Blender or producing music. This blend of technical logic and
                artistic creativity shapes how I approach design, performance,
                and user experience in web development.
              </p>
              <h3 className="text-xs font-(family-name:--font-family-jetbrains) text-neutral-400">
                TOOLKIT
              </h3>
              <ul className="font-(family-name:--font-family-jetbrains) underline text-neutral-300 *:w-1/2 *:inline-block *:border-t *:border-t *:border-neutral-600 *:py-2">
                <li>React</li>
                <li>Typescript</li>
                <li>Tailwind CSS</li>
                <li>Java</li>
                <li>HTML+CSS</li>
                <li>Git</li>
                <li>SQL</li>
                <li>PostgreSQL</li>
                <li>React Native</li>
                <li>Blender</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="min-h-screen bg-gradient-to-b from-neutral-950 to-black px-8 md:px-16 py-20"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="text-[15vw] md:text-[12vw] font-mono font-bold text-neutral-200 mb-12 select-none font-(family-name:--font-family-jetbrains)">
            CONTACT
          </h2>

          <form className="space-y-8">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-xs font-(family-name:--font-family-jetbrains) text-neutral-400 uppercase tracking-wider"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full bg-transparent border-b border-neutral-600 text-neutral-300 text-lg py-3 px-0 focus:outline-none focus:border-teal-400 transition-colors placeholder:text-neutral-600"
                placeholder="Your name"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-(family-name:--font-family-jetbrains) text-neutral-400 uppercase tracking-wider"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full bg-transparent border-b border-neutral-600 text-neutral-300 text-lg py-3 px-0 focus:outline-none focus:border-teal-400 transition-colors placeholder:text-neutral-600"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="subject"
                className="text-xs font-(family-name:--font-family-jetbrains) text-neutral-400 uppercase tracking-wider"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full bg-transparent border-b border-neutral-600 text-neutral-300 text-lg py-3 px-0 focus:outline-none focus:border-teal-400 transition-colors placeholder:text-neutral-600"
                placeholder="What's this about?"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-xs font-(family-name:--font-family-jetbrains) text-neutral-400 uppercase tracking-wider"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full bg-transparent border border-neutral-600 text-neutral-300 text-lg py-3 px-4 focus:outline-none focus:border-teal-400 transition-colors placeholder:text-neutral-600 resize-none"
                placeholder="Tell me what you're thinking..."
                required
              />
            </div>
            <Button
              onClick={() => {}}
              isCTA={true}
              className="w-full md:w-auto px-12 py-4 text-lg uppercase tracking-wider"
            >
              Send Message
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Index;
