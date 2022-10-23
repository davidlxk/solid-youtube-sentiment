import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import HomeScreen from './screens/home/HomeScreen';

const App: Component = () => {
  return (
    <div>
      <HomeScreen />
    </div>
  );
};

export default App;
