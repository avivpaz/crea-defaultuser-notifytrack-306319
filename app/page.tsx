'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GeneralHeader from './_components/GeneralHeader';
import { FaTruck, FaChartLine, FaBell, FaArrowRight, FaMobile, FaEnvelope, FaShieldAlt, FaPlay } from 'react-icons/fa';

export default function Home() {
  return (
    <main className="bg-secondary flex flex-col min-h-screen">
      <GeneralHeader />

      <div className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-primary via-primary to-primary-dark text-white py-20 sm:py-32 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-ping" style={{animationDuration: '3s'}}></div>
          </div>
          
          {/* Floating notification icons */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3s'}}>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <FaBell className="w-6 h-6 text-white/70" />
              </div>
            </div>
            <div className="absolute top-32 right-16 animate-bounce" style={{animationDelay: '1.5s', animationDuration: '4s'}}>
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
                <FaTruck className="w-5 h-5 text-white/70" />
              </div>
            </div>
            <div className="absolute bottom-40 left-20 animate-bounce" style={{animationDelay: '2s', animationDuration: '3.5s'}}>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <FaChartLine className="w-7 h-7 text-white/70" />
              </div>
            </div>
            <div className="absolute bottom-32 right-10 animate-bounce" style={{animationDelay: '0.8s', animationDuration: '3.2s'}}>
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
                <FaMobile className="w-4 h-4 text-white/70" />
              </div>
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Live notifications â¢ 99.9% uptime
              </div>

              {/* Main heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-tight">
                <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Smart Notifications
                </span>
                <span className="block text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-200 mt-2">
                  When You Need Them
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                Stop checking manually. Get instant alerts for your packages and stock prices. 
                <span className="block mt-2 text-white/90 font-medium">Peace of mind, delivered.</span>
              </p>

              {/* Statistics */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-blue-200 text-sm">Active Users</div>
                </div>
                <div className="hidden sm:block w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">1M+</div>
                  <div className="text-blue-200 text-sm">Notifications Sent</div>
                </div>
                <div className="hidden sm:block w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">99.9%</div>
                  <div className="text-blue-200 text-sm">Delivery Rate</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link 
                  href="/packages"
                  className="group relative bg-white text-primary px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-white/25 hover:scale-105 flex items-center"
                >
                  <FaTruck className="mr-3 text-xl group-hover:animate-pulse" />
                  Track Packages
                  <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="https://stocks.notifytracking.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-transparent border-2 border-white/50 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 backdrop-blur-sm hover:shadow-2xl hover:scale-105 flex items-center"
                >
                  <FaChartLine className="mr-3 text-xl group-hover:animate-pulse" />
                  Monitor Stocks
                  <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Demo link */}
              <div className="mt-8">
                <button className="group inline-flex items-center text-white/80 hover:text-white transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3 group-hover:bg-white/20 transition-colors">
                    <FaPlay className="w-4 h-4 ml-1" />
                  </div>
                  <span className="text-sm font-medium">See how it works</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Our Notification Services
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the service that fits your needs. Get real-time updates without the hassle.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Package Tracking Service */}
              <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow border">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                    <FaTruck className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Package Tracking</h3>
                    <p className="text-gray-600">Real-time delivery updates</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 text-lg">
                  Enter your tracking number and get instant notifications when your package status changes. 
                  Supports USPS, FedEx, UPS, and DHL.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Instant SMS & Email alerts</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>All major carriers supported</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Delivery predictions</span>
                  </div>
                </div>

                <Link
                  href="/packages"
                  className="w-full bg-primary text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center group"
                >
                  Start Tracking
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Stock Alerts Service */}
              <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow border">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                    <FaChartLine className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Stock Price Alerts</h3>
                    <p className="text-gray-600">Real-time price monitoring</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 text-lg">
                  Monitor your favorite stocks and get instant alerts when prices hit your target levels. 
                  Never miss a trading opportunity again.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Real-time price tracking</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Custom price targets</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Multiple stock symbols</span>
                  </div>
                </div>

                <a
                  href="https://stocks.notifytracking.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center group"
                >
                  Start Monitoring
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our Notifications?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Built for reliability, security, and ease of use.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FaMobile className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Delivery</h3>
                <p className="text-gray-600">
                  Get notifications within seconds of status changes. SMS and email delivery guaranteed.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FaShieldAlt className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-gray-600">
                  Your data is encrypted and never shared. We respect your privacy and security.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FaBell className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Alerts</h3>
                <p className="text-gray-600">
                  Intelligent filtering ensures you only get the notifications that matter most.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary py-16 sm:py-24">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Stay Informed?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Choose your service and start getting the notifications you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/packages"
                className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Track Your Packages
              </Link>
              <a 
                href="https://stocks.notifytracking.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-primary transition-colors"
              >
                Monitor Your Stocks
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 