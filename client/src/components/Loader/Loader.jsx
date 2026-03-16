import "./Loader.css";

const Loader = () => {
  const quotes = [
    "Style is a way to say who you are",
    "Elegance is about being remembered",
    "The joy of dressing is an art",
    "Fashion should be a form of escapism",
    "Simplicity is true elegance",
    "What you wear presents you to the world",
    "Fashion is armor for everyday life",
    "I design dreams, not clothes",
    "Clothes need someone to live in them",
    "Fashion is dressing to what's fashionable",
    "Style speaks without words",
    "Dress for yourself, not others",
    "Fashion fades, style is eternal",
    "Your style is your signature",
  ];

  const getRandomQuote = () => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="spinner"></div>
        <p className="quote">"{getRandomQuote()}"</p>
        <div className="dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
