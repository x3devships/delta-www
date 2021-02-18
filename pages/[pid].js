import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Referral = () => {
  const ISSERVER = typeof window === 'undefined';
  function getSecondPart(str) {
    return str.split('=')[1];
  }
  const router = useRouter();
  const { pid } = router.query;
  if (!ISSERVER) {
    // Access localStorage
    localStorage.setItem('r', getSecondPart(pid));
  }
  useEffect(() => {
    router.push('/');
  });
  return <div />;
};

export default Referral;
