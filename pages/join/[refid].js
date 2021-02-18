import { useRouter } from 'next/router'
import { useEffect } from 'react'

const RefHandler = () => {
  const router = useRouter()
  const { refid } = router.query
  useEffect(() => {
    window.localStorage.setItem('lastRef', refid)
  }, [refid])
  useEffect(() => {
     router.push("/")
  }, [])
  return "Enumerating..."
}
export default RefHandler