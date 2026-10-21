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

    // Also look for specific layout containers in the SuperAdmin Dashboard
    const rightPanelContainer = document.querySelector('.flex-1.flex.flex-col > .flex-1.overflow-y-auto');
    if (rightPanelContainer) {
      rightPanelContainer.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
