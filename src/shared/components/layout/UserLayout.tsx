import { Outlet, useLocation } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'

export default function UserLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
