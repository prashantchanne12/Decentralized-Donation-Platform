import React from 'react';
import { HomeIcon, PlusIcon } from '@heroicons/react/outline';
import Link from 'next/link';

const Header = () => {
  return (
    <div className='bg-violet-600 shadow-md sticky top-0'>
      <nav className='max-w-5xl mx-auto flex justify-between items-center'>
        <header className='p-[1.15rem]'>
          <h1 className='text-white font-semibold text-lg'>
            <Link href='/'>
              <a> Decentralized Donation</a>
            </Link>
          </h1>
        </header>
        <div className='text-white flex items-center space-x-8'>
          <Link href='/'>
            <a>
              <HomeIcon className='w-6 h-6 cursor-pointer hover:scale-125 transition-all duration-100 transform ease-out' />
            </a>
          </Link>
          <Link href='/add'>
            <a>
              <PlusIcon className='w-6 h-6 cursor-pointer hover:scale-125 transition-all duration-100 transform ease-out' />
            </a>
          </Link>
          {/* <Link href='/profile'>
            <a>
              <UserCircleIcon className='w-6 h-6 cursor-pointer hover:scale-125 transition-all duration-100 transform ease-out' />
            </a>
          </Link> */}
        </div>
      </nav>
    </div>
  );
};

export default Header;
