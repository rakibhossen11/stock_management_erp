'use client';

import { FiArrowRight, FiBarChart2, FiBox, FiDollarSign, FiShield, FiUsers } from 'react-icons/fi';
import Header from './components/Header'; // Adjust the import path as needed

export default function HomePage() {
  const features = [
    {
      icon: <FiBarChart2 className="h-8 w-8 text-blue-600" />,
      title: "Real-time Analytics",
      description: "Get instant insights into your business performance with our powerful dashboard."
    },
    {
      icon: <FiBox className="h-8 w-8 text-blue-600" />,
      title: "Inventory Management",
      description: "Track and manage your inventory with precision and automated alerts."
    },
    {
      icon: <FiDollarSign className="h-8 w-8 text-blue-600" />,
      title: "Sales Tracking",
      description: "Monitor sales, generate invoices, and analyze revenue streams."
    },
    {
      icon: <FiUsers className="h-8 w-8 text-blue-600" />,
      title: "Customer Management",
      description: "Maintain customer relationships and track interactions."
    },
    {
      icon: <FiShield className="h-8 w-8 text-blue-600" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security protecting your business data."
    }
  ];

  const testimonials = [
    {
      quote: "This ERP system transformed our business operations completely.",
      author: "Sarah Johnson",
      role: "CEO, TechCorp"
    },
    {
      quote: "The inventory management features saved us thousands in lost stock.",
      author: "Michael Chen",
      role: "Operations Manager, RetailPlus"
    },
    {
      quote: "Best decision we made was switching to this platform.",
      author: "David Wilson",
      role: "CFO, Global Solutions"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}
      
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Streamline Your Business with <span className="text-blue-600">Modern ERP</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Our comprehensive ERP solution helps you manage inventory, sales, customers, and more - all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/auth/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-center font-medium transition duration-300"
                >
                  Get Started Free
                </a>
                <a
                  href="#features"
                  className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg text-center font-medium transition duration-300"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="/images/dashboard-preview.png" // Replace with your actual image
                alt="ERP Dashboard Preview"
                className="rounded-lg shadow-xl border border-gray-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage and grow your business efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition duration-300">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Simple steps to transform your business operations
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <img
                src="/images/workflow-diagram.png" // Replace with your actual image
                alt="ERP Workflow Diagram"
                className="rounded-lg shadow-sm border border-gray-200"
              />
            </div>
            <div className="md:w-1/2">
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      1
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Sign Up & Setup</h3>
                    <p className="mt-2 text-gray-600">
                      Create your account and configure your business settings in minutes.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      2
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Import Your Data</h3>
                    <p className="mt-2 text-gray-600">
                      Easily migrate your existing data with our import tools.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      3
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Start Managing</h3>
                    <p className="mt-2 text-gray-600">
                      Begin tracking inventory, processing sales, and analyzing data.
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <a
                    href="/auth/signup"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Get started now <FiArrowRight className="ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Businesses</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands of companies revolutionizing their operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm">
                <div className="mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                      {testimonial.author.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of businesses using our ERP system to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/auth/signup"
              className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-medium transition duration-300"
            >
              Start Free Trial
            </a>
            <a
              href="/demo"
              className="border border-white text-white hover:bg-blue-600 px-8 py-3 rounded-lg text-lg font-medium transition duration-300"
            >
              Request Demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="/features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="/pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="/integrations" className="text-gray-400 hover:text-white">Integrations</a></li>
                <li><a href="/updates" className="text-gray-400 hover:text-white">Updates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="/press" className="text-gray-400 hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="/help" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="/docs" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="/community" className="text-gray-400 hover:text-white">Community</a></li>
                <li><a href="/webinars" className="text-gray-400 hover:text-white">Webinars</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-gray-400 hover:text-white">Privacy</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-white">Terms</a></li>
                <li><a href="/security" className="text-gray-400 hover:text-white">Security</a></li>
                <li><a href="/compliance" className="text-gray-400 hover:text-white">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-400">© {new Date().getFullYear()} ERP System. All rights reserved.</p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// 'use client'
// import { useState } from 'react';
// import Head from 'next/head';

// const mockProduct = {
//   id: 'erp-enterprise-2023',
//   name: 'EnterpriseERP Pro',
//   tagline: 'Comprehensive Business Management Solution',
//   description: 'EnterpriseERP Pro is an all-in-one business management solution that integrates all essential functions including accounting, inventory, CRM, HR, and more into a single, powerful platform.',
//   price: 4999,
//   features: [
//     'Real-time business analytics',
//     'Multi-currency and multi-language support',
//     'Customizable workflows',
//     'Cloud and on-premise deployment',
//     'Mobile app for on-the-go access',
//     'API for third-party integrations',
//     'Role-based access control',
//     'Automated reporting'
//   ],
//   modules: [
//     { name: 'Financial Management', included: true },
//     { name: 'Inventory Control', included: true },
//     { name: 'CRM', included: true },
//     { name: 'HR & Payroll', included: true },
//     { name: 'Project Management', included: true },
//     { name: 'E-commerce Integration', included: false },
//     { name: 'Advanced Analytics', included: false },
//     { name: 'AI Forecasting', included: false }
//   ],
//   testimonials: [
//     {
//       name: 'Sarah Johnson',
//       role: 'CFO, TechCorp',
//       quote: 'EnterpriseERP Pro transformed our operations. We reduced manual processes by 70% in the first 3 months.'
//     },
//     {
//       name: 'Michael Chen',
//       role: 'Operations Director, GlobalTrade',
//       quote: 'The inventory module alone paid for the system within 6 months through reduced waste and better tracking.'
//     }
//   ],
//   supportOptions: [
//     '24/7 Phone Support',
//     'Dedicated Account Manager',
//     'Online Knowledge Base',
//     'Quarterly Training Webinars'
//   ]
// };

// export default function Home() {
//   const [selectedTab, setSelectedTab] = useState('overview');
//   const [quantity, setQuantity] = useState(1);

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 0
//     }).format(price);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Head>
//         <title>{mockProduct.name} | EnterpriseERP Solutions</title>
//         <meta name="description" content={mockProduct.description} />
//       </Head>

//       {/* Header */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">{mockProduct.name}</h1>
//               <p className="mt-1 text-lg text-indigo-600">{mockProduct.tagline}</p>
//             </div>
//             <div className="mt-4 md:mt-0">
//               <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
//                 Request Demo
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Left Column - Product Info */}
//           <div className="lg:w-2/3">
//             {/* Product Image/Placeholder */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//               <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-64 flex items-center justify-center">
//                 <span className="text-white text-2xl font-bold">EnterpriseERP Pro Dashboard</span>
//               </div>
//             </div>

//             {/* Tabs */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//               <div className="border-b border-gray-200">
//                 <nav className="flex -mb-px">
//                   {['overview', 'features', 'modules', 'testimonials', 'support'].map((tab) => (
//                     <button
//                       key={tab}
//                       onClick={() => setSelectedTab(tab)}
//                       className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${selectedTab === tab
//                         ? 'border-indigo-500 text-indigo-600'
//                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                         }`}
//                     >
//                       {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                     </button>
//                   ))}
//                 </nav>
//               </div>

//               <div className="p-6">
//                 {selectedTab === 'overview' && (
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4">Product Overview</h2>
//                     <p className="text-gray-700 mb-4">{mockProduct.description}</p>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
//                       {mockProduct.features.slice(0, 4).map((feature, index) => (
//                         <div key={index} className="flex items-start">
//                           <svg className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                           <span className="text-gray-700">{feature}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {selectedTab === 'features' && (
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4">Key Features</h2>
//                     <ul className="space-y-3">
//                       {mockProduct.features.map((feature, index) => (
//                         <li key={index} className="flex items-start">
//                           <svg className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                           <span className="text-gray-700">{feature}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {selectedTab === 'modules' && (
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4">Included Modules</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {mockProduct.modules.map((module, index) => (
//                         <div key={index} className="flex items-center">
//                           {module.included ? (
//                             <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                             </svg>
//                           ) : (
//                             <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                           )}
//                           <span className={`${module.included ? 'text-gray-800' : 'text-gray-400'}`}>
//                             {module.name}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {selectedTab === 'testimonials' && (
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4">Customer Testimonials</h2>
//                     <div className="space-y-6">
//                       {mockProduct.testimonials.map((testimonial, index) => (
//                         <div key={index} className="bg-gray-50 p-6 rounded-lg">
//                           <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
//                           <div className="font-medium">
//                             <p className="text-gray-900">{testimonial.name}</p>
//                             <p className="text-indigo-600">{testimonial.role}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {selectedTab === 'support' && (
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4">Support Options</h2>
//                     <ul className="space-y-3">
//                       {mockProduct.supportOptions.map((option, index) => (
//                         <li key={index} className="flex items-start">
//                           <svg className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                           </svg>
//                           <span className="text-gray-700">{option}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Pricing & CTA */}
//           <div className="lg:w-1/3">
//             <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-8">
//               <div className="p-6 border-b border-gray-200">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-2">Pricing</h2>
//                 <div className="flex items-baseline">
//                   <span className="text-3xl font-bold text-gray-900">{formatPrice(mockProduct.price)}</span>
//                   <span className="ml-1 text-gray-500">/year</span>
//                 </div>
//                 <p className="mt-2 text-gray-600">Volume discounts available</p>
//               </div>

//               <div className="p-6">
//                 <div className="mb-4">
//                   <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
//                     Number of Users
//                   </label>
//                   <select
//                     id="quantity"
//                     value={quantity}
//                     onChange={(e) => setQuantity(parseInt(e.target.value))}
//                     className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                   >
//                     {[1, 5, 10, 25, 50, 100].map((num) => (
//                       <option key={num} value={num}>{num} user{num !== 1 ? 's' : ''}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="mb-6">
//                   <div className="flex justify-between py-2 border-b border-gray-200">
//                     <span className="text-gray-600">Base Price</span>
//                     <span className="text-gray-900">{formatPrice(mockProduct.price)}</span>
//                   </div>
//                   <div className="flex justify-between py-2 border-b border-gray-200">
//                     <span className="text-gray-600">Users ({quantity})</span>
//                     <span className="text-gray-900">{formatPrice(mockProduct.price * 0.2 * (quantity - 1))}</span>
//                   </div>
//                   <div className="flex justify-between py-2 font-bold">
//                     <span className="text-gray-900">Total</span>
//                     <span className="text-gray-900">
//                       {formatPrice(mockProduct.price + mockProduct.price * 0.2 * (quantity - 1))}
//                     </span>
//                   </div>
//                 </div>

//                 <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors mb-4">
//                   Add to Cart
//                 </button>

//                 <button className="w-full bg-white text-indigo-600 py-3 px-4 rounded-md font-medium border border-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
//                   Contact Sales
//                 </button>

//                 <div className="mt-6 text-center">
//                   <p className="text-sm text-gray-500">30-day money back guarantee</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       <footer className="bg-gray-800 text-white py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div>
//               <h3 className="text-lg font-semibold mb-4">EnterpriseERP</h3>
//               <p className="text-gray-400">Comprehensive business solutions for enterprises of all sizes.</p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-gray-400 hover:text-white">Products</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white">Solutions</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white">Resources</a></li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Contact</h3>
//               <ul className="space-y-2 text-gray-400">
//                 <li>support@enterpriseerp.com</li>
//                 <li>+1 (800) 123-4567</li>
//                 <li>123 Business Ave, Suite 100</li>
//                 <li>San Francisco, CA 94107</li>
//               </ul>
//             </div>
//           </div>
//           <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
//             <p>© 2023 EnterpriseERP Solutions. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
