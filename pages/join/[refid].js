import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Cookies from 'js-cookie'

const RefHandler = () => {
  const router = useRouter();
  const { refid } = router.query;

  useEffect(() => {
    window.localStorage.setItem('lastRef', refid);
    Cookies.set('lastRef', refid);
  }, [refid]);

  useEffect(() => {
    router.push('/');
  }, []);

  return true;
};
export default RefHandler;
