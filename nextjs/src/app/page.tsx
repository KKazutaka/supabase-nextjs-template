"use client";
import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import FeaturesSection from './components/FeaturesSection';
import PricingSection from './components/PricingSection';
import CtaSection from './components/CtaSection';
import FooterSection from './components/FooterSection';
import { Shield, Database, Users, Clock, Globe, Key } from 'lucide-react';

export default function Home() {
  const productName = process.env.NEXT_PUBLIC_PRODUCTNAME || 'SaaS Template';

  const features = [
    {
      icon: Shield,
      title: 'Robust Authentication',
      description: 'Secure login with email/password, Multi-Factor Authentication, and SSO providers',
      color: 'text-green-600'
    },
    {
      icon: Database,
      title: 'File Management',
      description: 'Built-in file storage with secure sharing, downloads, and granular permissions',
      color: 'text-orange-600'
    },
    {
      icon: Users,
      title: 'User Settings',
      description: 'Complete user management with password updates, MFA setup, and profile controls',
      color: 'text-red-600'
    },
    {
      icon: Clock,
      title: 'Task Management',
      description: 'Built-in todo system with real-time updates and priority management',
      color: 'text-teal-600'
    },
    {
      icon: Globe,
      title: 'Legal Documents',
      description: 'Pre-configured privacy policy, terms of service, and refund policy pages',
      color: 'text-purple-600'
    },
    {
      icon: Key,
      title: 'Cookie Consent',
      description: 'GDPR-compliant cookie consent system with customizable preferences',
      color: 'text-blue-600'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '10M+' },
    { label: 'Organizations', value: '2K+' },
    { label: 'Countries', value: '50+' },
    { label: 'Uptime', value: '99.9%' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header productName={productName} />
      <div className="pt-16">
        <HeroSection />
        <StatsSection stats={stats} />
        <FeaturesSection features={features} />
        <PricingSection />
        <CtaSection productName={productName} />
        <FooterSection productName={productName} />
      </div>
    </div>
  );
}