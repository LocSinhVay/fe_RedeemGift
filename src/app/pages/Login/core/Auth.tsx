import { FC, useState, useEffect, createContext, useContext } from 'react';
import { LayoutSplashScreen } from '../../../../_metronic/layout/core';
import { AuthModel } from './_models';
import * as authHelper from './AuthHelpers';
import { WithChildren } from '../../../../_metronic/helpers';

type AuthContextProps = {
  auth: AuthModel | null;
  saveAuth: (auth: AuthModel | null) => void;
  // updateSelectedProject: (projectCode: string | null) => void
  logout: () => void;
};

const AuthContext = createContext<AuthContextProps>({
  auth: null,
  saveAuth: () => { },
  // updateSelectedProject: () => { },
  logout: () => { },
});

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider: FC<WithChildren> = ({ children }) => {
  // const [auth, setAuth] = useState<AuthModel | null>(authHelper.getAuth());
  const [auth, setAuth] = useState<AuthModel | null>(() => authHelper.getAuth());


  // useEffect(() => {
  //   const storedAuth = authHelper.getAuth();
  //   if (storedAuth) {
  //     setAuth(storedAuth);
  //   }
  // }, []);

  const saveAuth = (newAuth: AuthModel | null) => {
    setAuth(prevAuth => {
      // So sánh stringify để tránh cập nhật nếu dữ liệu không đổi
      const isSame =
        JSON.stringify(prevAuth) === JSON.stringify(newAuth);
      if (isSame) return prevAuth;

      authHelper.setAuth(newAuth);
      return newAuth;
    });
  };

  // const updateSelectedProject = (projectCode: string | null) => {
  //   if (!auth) return
  //   const updated = { ...auth, SelectedProject: projectCode }
  //   setAuth(updated)
  //   authHelper.setAuth(updated)
  // }

  const logout = () => {
    saveAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, saveAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const AuthInit: FC<WithChildren> = ({ children }) => {
  const { auth, logout } = useAuth();
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  // useEffect(() => {
  //   if (auth?.Token) {
  //     setShowSplashScreen(false);
  //   } else {
  //     logout();
  //     setShowSplashScreen(false);
  //   }
  // }, [auth, logout]);

  useEffect(() => {
    if (!auth?.Token && auth !== null) {
      logout();
    }
    setShowSplashScreen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>;
};

export { AuthProvider, AuthInit, useAuth };