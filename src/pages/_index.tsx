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
    <div className="w-screen h-screen bg-radial from-neutral-800 to-neutral-900">
      <div className="h-full w-full flex flex-col justify-center cursor-default px-8 md:px-16">
        <h1 className="text-[20vw] font-mono font-bold text-neutral-200 tracking-tighter leading-[0.85] text-left select-none">
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
  );
};

export default Index;
