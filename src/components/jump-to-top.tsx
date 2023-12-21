import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { ArrowUpIcon } from '@radix-ui/react-icons'

export default function JumpToTop() {
  const [showButton, setShowButton] = useState(false)

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setShowButton(true)
    } else {
      setShowButton(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <Button
      onClick={scrollToTop}
      variant={'secondary'}
      className={`fixed bottom-4 right-4 z-50 hover:bottom-5 transition-all ${
        showButton ? 'block' : 'hidden'
      }`}
    >
      <ArrowUpIcon />
    </Button>
  )
}
