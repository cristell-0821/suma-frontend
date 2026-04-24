const Footer = () => {
  const links = ['Soporte', 'Accesibilidad', 'Términos', 'Privacidad'];

  return (
    <footer className="bg-cream-100 w-full rounded-t-[2rem] mt-12">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 w-full max-w-7xl mx-auto">
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <div className="font-sans font-black text-teal text-2xl mb-2">Suma</div>
          <p className="text-brown/60 max-w-xs font-sans text-sm">
            © 2024 Suma. Honrando la dignidad a través del diseño.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {links.map((link) => (
            <a
              key={link}
              href="#"
              className="text-brown/60 hover:text-coral underline decoration-2 underline-offset-4 transition-all font-sans text-sm"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;