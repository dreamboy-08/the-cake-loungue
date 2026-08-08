"use client";

import React from 'react';
import Image from 'next/image';
import { useCMS } from '@/context/CMSContext';
import { DEFAULT_ABOUT_SETTINGS } from '@/constants/cmsDefaults';
import {
  Sprout,
  Hand,
  Truck,
  Heart,
  Sparkles,
  Cake,
  Gift,
  ShoppingBag,
  Award,
  Star,
  Smile,
  Coffee,
  Clock,
  Flame,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

// Icon Renderer Helper
const getIconComponent = (iconName: string, size = 20) => {
  switch (iconName) {
    case 'Sprout': return <Sprout size={size} />;
    case 'Hand': return <Hand size={size} />;
    case 'Truck': return <Truck size={size} />;
    case 'Heart': return <Heart size={size} />;
    case 'Sparkles': return <Sparkles size={size} />;
    case 'Cake': return <Cake size={size} />;
    case 'Gift': return <Gift size={size} />;
    case 'ShoppingBag': return <ShoppingBag size={size} />;
    case 'Award': return <Award size={size} />;
    case 'Star': return <Star size={size} />;
    case 'Smile': return <Smile size={size} />;
    case 'Coffee': return <Coffee size={size} />;
    case 'Clock': return <Clock size={size} />;
    case 'Flame': return <Flame size={size} />;
    case 'Shield': return <Shield size={size} />;
    default: return <Award size={size} />;
  }
};

const About = () => {
  const { aboutSettings, loading } = useCMS();

  // Graceful fallback to default settings if CMS is loading or unavailable
  const settings = (loading || !aboutSettings) ? DEFAULT_ABOUT_SETTINGS : aboutSettings;

  // If section is disabled by the admin, return null to hide it entirely from the storefront
  if (!settings.enabled) {
    return null;
  }

  // Map Animation Type to Framer Motion parameters
  const getAnimationProps = () => {
    const duration = settings.animationDuration ?? 0.8;
    const delay = settings.animationDelay ?? 0.1;

    switch (settings.animationType) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          transition: { duration, delay }
        };
      case 'slide-up':
        return {
          initial: { opacity: 0, y: 50 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration, delay, ease: [0.16, 1, 0.3, 1] }
        };
      case 'slide-left':
        return {
          initial: { opacity: 0, x: 50 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true },
          transition: { duration, delay, ease: [0.16, 1, 0.3, 1] }
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.92 },
          whileInView: { opacity: 1, scale: 1 },
          viewport: { once: true },
          transition: { duration, delay, ease: [0.16, 1, 0.3, 1] }
        };
      case 'none':
      default:
        return {
          initial: { opacity: 1 },
          whileInView: { opacity: 1 },
          transition: { duration: 0 }
        };
    }
  };

  const animProps = getAnimationProps();

  // Helper to split text by newline for elegant paragraphs if required
  const formattedHeading = settings.heading ? settings.heading.split('\n').map((line, idx) => (
    <React.Fragment key={idx}>
      {line}
      {idx < settings.heading.split('\n').length - 1 && <br />}
    </React.Fragment>
  )) : '';

  return (
    <section
      id="about"
      style={{
        backgroundColor: settings.backgroundColor || '#ffffff',
        backgroundImage: settings.gradient !== 'none' ? settings.gradient : undefined,
      }}
      className={`${settings.sectionPadding || 'py-[100px]'} relative transition-all duration-300`}
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Visual Column */}
          <div
            className={`relative hidden lg:block ${
              settings.imageLayout === 'right' ? 'lg:order-2' : 'lg:order-1'
            }`}
          >
            {/* Ambient golden glow blob */}
            <div className="absolute top-[-20px] left-[-20px] w-[100px] h-[100px] bg-gold-light rounded-full z-0 opacity-60"></div>

            {/* Image Container with Custom Width, Radius and Shadow controls */}
            <motion.div
              {...animProps}
              className={`overflow-hidden aspect-[4/5] relative ${settings.imageBorderRadius || 'rounded-xl'} ${settings.imageShadow || 'shadow-lg'}`}
              style={{ width: settings.imageWidth || '100%' }}
            >
              <Image
                src={settings.leftImageUrl || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80'}
                alt="Our Story Illustration"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </motion.div>

            {/* Experience Floating Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (settings.animationDelay || 0.1) + 0.3, duration: 0.6 }}
              className="absolute bottom-[-24px] right-[-24px] bg-white rounded-[14px] p-6 shadow-md z-[2] max-w-[200px]"
            >
              <div
                style={{ color: settings.accentColor || '#c9614a' }}
                className="font-playfair text-[2.2rem] font-bold leading-none"
              >
                {settings.experienceNumber || '10+'}
              </div>
              <p className="text-[0.8rem] text-text-soft mt-1 leading-[1.4]">
                {settings.experienceDesc || 'Years of crafting joyful memories with every cake'}
              </p>
            </motion.div>
          </div>

          {/* Content */}
          <div className="about-content">
            <p className="section-label">Our Story</p>
            <h2 className="section-title">{label}</h2>
            <p className="mt-4 text-[0.95rem] text-text-soft leading-[1.7] max-w-full">
              {description}
            </p>

              <h2
                style={{ color: settings.headingColor || '#3d1f10' }}
                className="section-title"
              >
                {formattedHeading}
              </h2>

              {/* Rich text container */}
              <div
                style={{ color: settings.textColor || '#a07860' }}
                className="mt-4 text-[0.95rem] leading-[1.7] max-w-full space-y-4 font-poppins font-normal"
                dangerouslySetInnerHTML={{ __html: settings.storyContent }}
              />
            </motion.div>

            {/* Feature list */}
            <div className="mt-9 flex flex-col gap-5">
              {settings.features && settings.features
                .filter(feat => feat.enabled)
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((feat, i) => (
                  <motion.div
                    key={feat.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (settings.animationDelay || 0.1) + (i * 0.1), duration: 0.6 }}
                    className="flex items-start gap-4"
                  >
                    <div
                      style={{ color: settings.accentColor || '#c9614a' }}
                      className="w-11 h-11 min-w-[44px] bg-cream-dark rounded-sm flex items-center justify-center"
                    >
                      {getIconComponent(feat.icon)}
                    </div>
                    <div>
                      <h4
                        style={{ color: settings.headingColor || '#3d1f10' }}
                        className="text-[0.95rem] font-semibold mb-0.5"
                      >
                        {feat.title}
                      </h4>
                      <p
                        style={{ color: settings.textColor || '#a07860' }}
                        className="text-[0.82rem] leading-[1.5]"
                      >
                        {feat.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
