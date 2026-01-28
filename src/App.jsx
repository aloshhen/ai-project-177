import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Mail, Phone, Send, X, Menu, Globe, Users, Target } from 'lucide-react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// 3D Interactive Map Component
const InteractiveMap = () => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [selectedOffice, setSelectedOffice] = useState(null)

  const offices = [
    {
      id: 1,
      city: 'Paris',
      coordinates: [2.3522, 48.8566],
      address: '45 Avenue des Champs-Élysées, 75008 Paris, France',
      phone: '+33 1 23 45 67 89',
      email: 'paris@architecture-bureau.com'
    },
    {
      id: 2,
      city: 'London',
      coordinates: [-0.1276, 51.5074],
      address: '100 Oxford Street, London W1D 1LL, United Kingdom',
      phone: '+44 20 1234 5678',
      email: 'london@architecture-bureau.com'
    }
  ]

  useEffect(() => {
    if (map.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [1.1, 50.0],
      zoom: 4.5,
      pitch: 45,
      bearing: 0,
      attributionControl: false,
      interactive: true,
      dragPan: true,
      dragRotate: true,
      scrollZoom: true,
      touchZoomRotate: true,
      doubleClickZoom: true,
      keyboard: true
    })

    map.current.addControl(new maplibregl.NavigationControl({
      visualizePitch: true
    }), 'top-right')

    offices.forEach(office => {
      const el = document.createElement('div')
      el.className = 'custom-marker'
      el.style.cssText = `
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: all 0.3s ease;
      `
      
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)'
        el.style.boxShadow = '0 6px 20px rgba(30,41,59,0.5)'
      })
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)'
        el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
      })

      el.addEventListener('click', () => {
        setSelectedOffice(office)
        map.current.flyTo({
          center: office.coordinates,
          zoom: 12,
          pitch: 60,
          bearing: 0,
          duration: 2000
        })
      })

      new maplibregl.Marker({ element: el })
        .setLngLat(office.coordinates)
        .addTo(map.current)
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <style>{`
        .maplibregl-ctrl-attrib { display: none !important; }
        .maplibregl-ctrl-logo { display: none !important; }
        .maplibregl-compact { display: none !important; }
      `}</style>
      <div ref={mapContainer} className="absolute inset-0 rounded-2xl overflow-hidden" />
      
      {selectedOffice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 left-6 bg-white rounded-xl shadow-2xl p-6 max-w-sm z-10"
        >
          <button
            onClick={() => setSelectedOffice(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedOffice.city} Office</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-600 mt-1 flex-shrink-0" />
              <p className="text-gray-700">{selectedOffice.address}</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-slate-600 flex-shrink-0" />
              <a href={`tel:${selectedOffice.phone}`} className="text-gray-700 hover:text-slate-900 transition-colors">
                {selectedOffice.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-600 flex-shrink-0" />
              <a href={`mailto:${selectedOffice.email}`} className="text-gray-700 hover:text-slate-900 transition-colors">
                {selectedOffice.email}
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const projectsRef = useRef(null)
  const projectsInView = useInView(projectsRef, { once: true, amount: 0.2 })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for your message! We will contact you soon.')
    setFormData({ name: '', email: '', message: '' })
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Architecture Bureau</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('map')} className="text-gray-600 hover:text-slate-900 transition-colors font-medium">
              Map
            </button>
            <button onClick={() => scrollToSection('projects')} className="text-gray-600 hover:text-slate-900 transition-colors font-medium">
              Projects
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-slate-900 transition-colors font-medium">
              Contact
            </button>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-900"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
        
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
              <button onClick={() => scrollToSection('map')} className="text-gray-600 hover:text-slate-900 transition-colors text-left">
                Map
              </button>
              <button onClick={() => scrollToSection('projects')} className="text-gray-600 hover:text-slate-900 transition-colors text-left">
                Projects
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-slate-900 transition-colors text-left">
                Contact
              </button>
            </div>
          </motion.div>
        )}
      </header>

      {/* MAP SECTION */}
      <section id="map" className="pt-24 pb-12 px-6 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 tracking-tight">
              Our Offices
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Architectural excellence across Europe. Visit our studios in Paris and London.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full h-[600px] md:h-[700px] shadow-2xl rounded-2xl overflow-hidden"
          >
            <InteractiveMap />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">International Presence</h3>
              <p className="text-gray-600">
                Operating in major European cities with a global vision
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Precision Design</h3>
              <p className="text-gray-600">
                Every detail matters in our architectural approach
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Team</h3>
              <p className="text-gray-600">
                Award-winning architects and designers
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" ref={projectsRef} className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={projectsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our portfolio of innovative architectural solutions
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={projectsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-[4/3]">
                <img 
                  src="/user-photo-1.jpg" 
                  alt="Modern residential complex"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold mb-2">Modern Residential Complex</h3>
                  <p className="text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    Sustainable living spaces with contemporary design
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={projectsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-[4/3]">
                <img 
                  src="/user-photo-2.jpg" 
                  alt="Urban office development"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold mb-2">Urban Office Development</h3>
                  <p className="text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    Innovative workspace solutions for the modern business
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={projectsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-[4/3]">
                <img 
                  src="/user-photo-3.jpg" 
                  alt="Cultural center renovation"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold mb-2">Cultural Center Renovation</h3>
                  <p className="text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    Preserving heritage while embracing modernity
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={projectsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-[4/3]">
                <img 
                  src="/user-photo-4.jpg" 
                  alt="Luxury hotel design"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold mb-2">Luxury Hotel Design</h3>
                  <p className="text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    Creating unforgettable hospitality experiences
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600">
              Let's discuss your next architectural project
            </p>
          </motion.div>
          
          <motion.form action="https://api.web3forms.com/submit" method="POST" data-patch-version="v20" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            data-onsubmit="disabled"
            className="space-y-6"
          >
              <input type="hidden" name="access_key" value="649307c8-af39-4b58-b850-e92ef3bb6b82" />
              <input type="hidden" name="from_name" value="AI Project [v20]" />
              <input type="hidden" name="subject" value="New Application from Website" />
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input name="name" 
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input name="email" 
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea name="message" 
                id="message"
                required
                rows="6"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none resize-none"
                placeholder="Tell us about your project..."
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg"
            >
              Send Message
              <Send className="w-5 h-5" />
            </button>
          </motion.form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-gray-900" />
              </div>
              <span className="text-xl font-bold text-white">Architecture Bureau</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Paris & London</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@architecture-bureau.com</span>
              </div>
            </div>
          </div>
          
          <div className="text-center text-gray-500 text-sm mt-8 pt-8 border-t border-gray-800">
            © 2024 Architecture Bureau. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App