


export default function Navbar() {
 

  

  
  
 
  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <a href="/" className="flex gap-2 flex-center">
        <img
          src="src/assets/logo.svg"
          alt="Promptopia Logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text">Investo.</p>
      </a>
      <div className="sm:flex hidden">
        
      </div>

      <div className="sm:hidden flex relative">
        
      </div>
    </nav>
  );
}
