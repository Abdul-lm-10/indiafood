import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollRestoration = () => {
    const { pathname } = useLocation();
  
    useEffect(() => {
      window.scrollTo(0, 0);  // Scroll to the top of the page on route change
    }, [pathname]);
  };
  
  export default useScrollRestoration;