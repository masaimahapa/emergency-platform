import React from 'react';
import {Link} from 'react-router';
import {Siren} from 'lucide-react';
function Navbar(){
    const navItems = [
        {
            name: 'Dashboard',
            path: '/'
        },
        {
            name: 'Emergencies',
            path: '/emergencies'
        }
    ]
    return(
        <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
                <div className="flex items-center gap-2">
                    <Siren size={32} className="text-blue-600"/>
                    <h1 className="text-xl font-semibold">Aura Emergency Response</h1>
                </div>
                
                <ul className="flex gap-6">
                    {navItems.map((item, idx) => (
                        <li key={idx}>
                            <Link 
                                to={item.path}
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
    )
}

export default Navbar;