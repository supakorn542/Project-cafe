// src/app/page.tsx
import Link from 'next/link';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className='min-h-screen flex items-center justify-center bg-[#FBF6F0] p-4'>
      <h1 className='font-serif4 font-bold text-3xl'>Welcome to Home Page</h1>

      </div>
     
    </div>
  );
}
