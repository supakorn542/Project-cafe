"use client";
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Navbar from '../components/Navbar';


export default function Profile() {

  return (
    <div>
      <Navbar></Navbar>
      <h1>TEST Emulator</h1>
      <h1>Users</h1>
    </div>
  );
}
