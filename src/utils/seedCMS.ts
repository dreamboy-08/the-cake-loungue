import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const CMS_DEFAULTS = {
  siteSettings: {
    id: 'general',
    data: {
      logoText: 'Cake Lounge',
      copyrightText: '© 2025 Cake Lounge Patisserie. All rights reserved.',
      announcementBar: {
        enabled: true,
        text: 'Free Delivery Above ₹999',
        link: '/menu',
        startDate: '',
        endDate: ''
      },
      deliveryCharges: 0,
      minOrderAmount: 0,
      deliveryTiming: '45 - 60 mins'
    }
  },
  contactInfo: {
    id: 'primary',
    data: {
      phone: '',
      email: '',
      address: '',
      whatsapp: '',
      googleMaps: '',
      socialLinks: {
        instagram: '',
        facebook: '',
        pinterest: ''
      }
    }
  },
  homepageContent: {
    id: 'main',
    data: {
      hero: {
        title: 'Exquisite Cakes Delivered Fresh',
        subtitle: 'Handcrafted with love using only the finest ingredients.',
        ctaPrimary: { text: 'Order Now', link: '/menu' },
        ctaSecondary: { text: 'View Menu', link: '/menu' },
        images: []
      },
      about: {
        title: 'Baked with Passion, Served with Love',
        description: 'Cake Lounge was born from a grandmother\'s kitchen in 2015. What started as late-night baking sessions and recipes passed down through generations has blossomed into a beloved patisserie trusted by thousands.'
      },
      gallery: [],
      testimonials: [
        { id: 1, name: 'Priya Sharma', role: 'Birthday Celebration', text: 'The cake was absolutely beautiful and tasted even better!', rating: 5 },
        { id: 2, name: 'Rahul Verma', role: 'Anniversary', text: 'Best red velvet cake in town. Highly recommended!', rating: 5 }
      ],
      sections: [
        { id: 'hero', title: 'Hero Banner', enabled: true, order: 0 },
        { id: 'offers', title: 'Offers Bar', enabled: true, order: 1 },
        { id: 'categories', title: 'Featured Categories', enabled: true, order: 2 },
        { id: 'featured', title: 'Featured Products', enabled: true, order: 3 },
        { id: 'about', title: 'Our Story', enabled: true, order: 4 },
        { id: 'testimonials', title: 'Testimonials', enabled: true, order: 5 },
        { id: 'contact', title: 'Contact Section', enabled: true, order: 6 }
      ]
    }
  },
  businessHours: {
    id: 'standard',
    data: {
      mon_fri: '10:00 AM - 10:00 PM',
      sat_sun: '09:00 AM - 11:00 PM',
      delivery: '11:00 AM - 09:00 PM',
      opening: '10:00 AM',
      closing: '10:00 PM'
    }
  }
};

export const seedCMS = async (force = false) => {
  console.log('Starting CMS seeding...');

  for (const [collectionName, config] of Object.entries(CMS_DEFAULTS)) {
    try {
      const docRef = doc(db, collectionName, config.id);

      if (!force) {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log(`CMS document ${collectionName}/${config.id} already exists. Skipping.`);
          continue;
        }
      }

      console.log(`Seeding CMS document: ${collectionName}/${config.id}`);
      await setDoc(docRef, {
        ...config.data,
        updatedAt: new Date().toISOString()
      }, { merge: true });

    } catch (error) {
      console.error(`Error seeding CMS document ${collectionName}:`, error);
    }
  }

  console.log('CMS seeding completed!');
};
