'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#00008B] text-white pt-16">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="bg-[#08153A] border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-[#00FFEF]" />
                  <span>Send us a Message</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#00FFEF] text-black hover:bg-[#00FFEF]/90 h-12"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Company Info */}
            <Card className="bg-[#08153A] border-white/10">
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-[#00FFEF] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                                         <p className="text-gray-300">info@davietech.com</p>
                     <p className="text-gray-300">support@davietech.com</p>
                  </div>
                </div>

                                 <div className="flex items-start space-x-3">
                   <Phone className="h-5 w-5 text-[#00FFEF] mt-1 flex-shrink-0" />
                   <div>
                     <h3 className="font-semibold">Phone</h3>
                     <p className="text-gray-300">+254 751 030 250</p>
                     <p className="text-gray-300">+254 725 172 596</p>
                   </div>
                 </div>

                                 <div className="flex items-start space-x-3">
                   <MapPin className="h-5 w-5 text-[#00FFEF] mt-1 flex-shrink-0" />
                   <div>
                     <h3 className="font-semibold">Address</h3>
                     <p className="text-gray-300">
                       Old Batian Building,<br />
                       Along Gakere Road<br />
                       Opposite Club Zillion<br />
                       Nyeri, Kenya
                     </p>
                   </div>
                 </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-[#00FFEF] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Business Hours</h3>
                    <p className="text-gray-300">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-300">Saturday: 9:00 AM - 4:00 PM</p>
                    <p className="text-gray-300">Sunday: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="bg-[#08153A] border-white/10">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">How long does shipping take?</h4>
                  <p className="text-gray-300 text-sm">
                    Standard delivery takes 2-3 business days within Nairobi and 3-5 business days for other regions in Kenya.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
                  <p className="text-gray-300 text-sm">
                    We accept M-PESA, bank transfers, and all major credit/debit cards including Visa, Mastercard, and American Express.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Do you offer returns and refunds?</h4>
                  <p className="text-gray-300 text-sm">
                    Yes, we offer a 30-day return policy for most items. Products must be in original condition with all packaging intact.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="bg-[#08153A] border-white/10">
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20">
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20">
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20">
                    Instagram
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20">
                    LinkedIn
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card className="bg-[#08153A] border-white/10">
            <CardHeader>
              <CardTitle>Our Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                     <p className="text-gray-300">Interactive map will be displayed here</p>
                   <p className="text-sm text-gray-400 mt-2">
                     Old Batian Building, Along Gakere Road, Opposite Club Zillion, Nyeri, Kenya
                   </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
} 