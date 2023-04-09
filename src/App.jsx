import React, { useState, useEffect } from 'react';
import 'firebase/compat/firestore';
import 'firebase/compat/database';
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import './App.css';

const app = initializeApp({
  projectId: "mindco-df9af",
  apiKey: "AIzaSyCoh8jK7yOCyNPmtRoc-33BQfjeUAeaa7A",
  authDomain: "mindco-df9af.firebaseapp.com",
});
const functions = getFunctions(app);
const saveUserData = httpsCallable(functions, 'saveUserData', {
  headers: {
    "Content-Type": "application/json"
  }
});

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [messageError, setError] = useState('');

  const clearError = setTimeoutClear(() => {
    setError('');
  }, 2000);

  useEffect(() => {
    if (messageError !== '') {
      clearError();
    }
  }, [messageError, clearError]);

  function setTimeoutClear(func, time) {
    const timeout = setTimeout(func, time);

    function clear() {
      clearTimeout(timeout);
    }

    return clear;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Error: todos los campos son obligatorios');
      return;
    }

    const emailRegex = /^[^@]+@[^@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(email)) {
      setError('Error: el correo electrónico no es válido');
      return;
    }

    if (!phoneRegex.test(phone)) {
      setError('Error: el número de teléfono no es válido');
      return;
    }

    const data = {
      name,
      email,
      phone
    };

    saveUserData(JSON.stringify(data)).then((result) => {
      console.log(result);
      setName('');
      setEmail('');
      setPhone('');
    }).catch((error) => {
      console.log(error);
      setError('Error: no se pudo guardar la información');
    });
  }

  return (
    <form onSubmit={handleSubmit} className="container">
      <div>

        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="phone">Phone:</label>
        <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <button type="submit">Submit</button>

      {messageError && <p>{messageError}</p>}
    </form>
  );
};

export default App;
