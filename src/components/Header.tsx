import React from 'react';
import { Link } from 'react-router-dom';
import { CubeIcon } from '@heroicons/react/20/solid';

const Header: React.FC = () => {
    return (
        <nav className="bg-black p-4 text-white">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                <div className="text-white font-bold text-2xl">
                    <Link to="/" className="text-white flex items-center">
                    <CubeIcon className="h-8 w-8 mr-2 inline-block" />
                    Malik's Memory Lane
                    </Link>
                </div>
                <div className="space-x-4">
                    <Link to="/create" className="text-white">Create New Memory</Link>
                </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;