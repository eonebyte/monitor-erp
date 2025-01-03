// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// App.js
import { useDispatch, useSelector } from 'react-redux';
import { TabMenu } from './components/TabMenu';
import { useEffect } from 'react';
import { checkAuthStatus } from './states/reducers/authSlice';
import Login from './pages/auth/Login';
import { Spin } from 'antd';

function App() {
  const dispatch = useDispatch();
  const { auth, isLoading } = useSelector((state) => state.auth);

  // Cek status autentikasi saat aplikasi pertama kali dimuat
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Jika sedang loading, tampilkan spinner
  if (isLoading) {
    return <Spin tip="Loading..." spinning={isLoading} fullscreen />;
  }

  // Jika tidak autentikasi, tampilkan halaman login
  if (!auth) {
    return <Login />;
  }

  // Jika autentikasi berhasil, tampilkan TabMenu
  return <TabMenu />;
}

export default App;

