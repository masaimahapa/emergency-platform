import { Link, useLocation } from 'react-router';
import { Siren, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    
    const navItems = [
        {
            name: 'Dashboard',
            path: '/'
        },
        {
            name: 'Emergencies',
            path: '/emergencies'
        },
        {
            name: 'Responders',
            path: '/responders'
        }
    ];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const isActive = (path: string) => {
        return location.pathname === path;
    }

    return (
        <div className="sticky top-0 z-50 bg-white shadow-sm" ref={navRef}>

            <nav className="hidden md:flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <Siren size={28} className="text-blue-600"/>
                    <h1 className="text-xl font-bold text-gray-800">Aura Emergency Response</h1>
                </div>
                
                <div className="flex items-center gap-8">
                    <ul className="flex gap-8">
                        {navItems.map((item, idx) => (
                            <li key={idx}>
                                <Link 
                                    to={item.path}
                                    aria-current={isActive(item.path) ? "page" : undefined}
                                    className={`py-2 px-1 font-medium transition-colors duration-200 relative ${
                                        isActive(item.path) 
                                        ? "text-blue-600" 
                                        : "text-gray-600 hover:text-blue-600"
                                    }`}
                                >
                                    {item.name}
                                    {isActive(item.path) && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
    
                </div>
            </nav>


            <div className="flex items-center justify-between p-4 md:hidden">
                <div className="flex items-center gap-2">
                    <Siren size={20} className="text-blue-600"/>
                    <h1 className="text-lg font-bold text-gray-800">Aura Emergency Response</h1>
                </div>
                
                <div className="flex items-center gap-3">

                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        aria-expanded={isOpen}
                        aria-label="Toggle navigation menu"
                        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            <div 
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <nav className="bg-white shadow-inner">
                    <ul className="flex flex-col p-4">
                        {navItems.map((item, idx) => (
                            <li key={idx} className="border-b border-gray-100 last:border-0">
                                <Link 
                                    to={item.path}
                                    aria-current={isActive(item.path) ? "page" : undefined}
                                    className={`block py-3 px-2 transition-colors ${
                                        isActive(item.path) 
                                        ? "text-blue-600 font-medium" 
                                        : "text-gray-600 hover:text-blue-600"
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default Navbar;