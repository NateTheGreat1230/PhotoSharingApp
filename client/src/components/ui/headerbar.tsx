import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Link } from 'react-router-dom';
import HamburgerIcon from '../icons/hamburgerIcon';
import PersonIcon from '../icons/personIcon';
import { logout, type User } from '../../api/auth';

export default function HeaderBar({ user }: { user: User | null }) {
  return (
    <header className='flex items-center justify-between px-4 py-2 bg-primary text-text shadow-md rounded-b-lg'>
      <Menu as='div' className='relative'>
        <MenuButton className='animate-colors p-2 rounded-md hover:bg-accent/20 focus:outline-none'>
          <HamburgerIcon classes='w-6 h-6 fill-white' />
        </MenuButton>
        <MenuItems
          anchor='bottom start'
          className='mt-2 w-48 rounded-md bg-white shadow-lg focus:outline-none transition-transform duration-200 ease-out data-closed:scale-95 data-closed:opacity-0'
        >
          <div className='py-1'>
            <MenuItem as={Link} to='/' className='menu-item'>
              Home
            </MenuItem>
            <div className='border-t border-gray-200' />
            <MenuItem as={Link} to='/gallery' className='menu-item'>
              Gallery
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>

      <h1 className='text-lg font-semibold'>PhotoApp</h1>

      <div className='flex items-center gap-2'>
        <Menu as='div' className='relative'>
          <MenuButton className='p-2 rounded-full hover:bg-accent/20 animate-colors'>
            <span className='flex items-center'>
              <span className='hidden md:flex items-center gap-3 mr-3'>
                <span className=''>{user?.full_name}</span>
                <span className='border-l border-white h-6' />
              </span>
              <PersonIcon classes='w-6 h-6' />
            </span>
          </MenuButton>
          <MenuItems
            anchor='bottom end'
            className='mt-2 w-48 rounded-md bg-white shadow-lg focus:outline-none transition-transform duration-200 ease-out data-closed:scale-95 data-closed:opacity-0'
          >
            <div className='py-1'>
              <MenuItem as={Link} to='/profile' className='menu-item'>
                View Profile
              </MenuItem>
              <div className='border-t border-gray-200' />
              <MenuItem
                as='button'
                onClick={() => logout()}
                className='menu-item'
              >
                Logout
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>
    </header>
  );
}
