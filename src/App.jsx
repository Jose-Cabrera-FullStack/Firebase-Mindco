import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import './App.css'
import firebaseConfig from './configFirebase';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const clearError = setTimeoutClear(() => {
    setError('');
  }, 2000);

  useEffect(() => {
    if (error !== '') {
      clearError();
    }
  }, [error, clearError]);

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

    const app = firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore(app);

    const date = firebase.firestore.FieldValue.serverTimestamp();

    db.collection('users').add({
      name,
      email,
      phone,
      date
    })
      .then(refDoc => {
        console.log('Document successfully written!', refDoc.id);
      })
      .catch(error => {
        console.error('Error adding document: ', error);
        setError(error.message);
      });

    setName('');
    setEmail('');
    setPhone('');
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

      {error && <p>{error}</p>}
    </form>
  );
};

export default App;
