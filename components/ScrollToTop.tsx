import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Instant scroll to top on route change
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // We want strict reset, 'smooth' can be slow if page is long
        });
    }, [pathname]);

    return null;
}
