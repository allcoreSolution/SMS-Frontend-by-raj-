import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Attempt standard window scroll
    window.scrollTo(0, 0);
    
    // Attempt to scroll common standard layout containers
    const commonContainers = document.querySelectorAll('.overflow-y-auto, main, #root > div > div > div');
    commonContainers.forEach(container => {
      container.scrollTo(0, 0);
    });

    // Main scroll area in School ERP Layout
    const mainContainer = document.querySelector('.min-h-screen.bg-\\[\\#EDF2F7\\].overflow-y-auto');
    if (mainContainer) {
      mainContainer.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
