import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { getContactInfo } from '@/utils/adminService';

const Contact = () => {
  const [contact, setContact] = useState<any>(null);

  useEffect(() => {
    const fetchContact = async () => {
      const data = await getContactInfo();
      setContact(data);
    };
    fetchContact();
  }, []);

  return (
    <section id="contact" className="py-[100px] bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="contact-info">
            <p className="section-label">Get In Touch</p>
            <h2 className="section-title mb-4">Let&apos;s Create Something Sweet Together</h2>
            <p className="section-sub">Have a special order in mind? Want to know more about our bespoke cakes? We&apos;d love to hear from you.</p>

            <div className="mt-9 flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cream-dark rounded-sm flex items-center justify-center text-rose-deep shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-[0.88rem] font-semibold text-chocolate">Find Us</h4>
                  <p className="text-[0.82rem] text-text-soft mt-0.5">{contact?.address || "12, Rose Garden Lane, Connaught Place, New Delhi – 110001"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cream-dark rounded-sm flex items-center justify-center text-rose-deep shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-[0.88rem] font-semibold text-chocolate">Call Us</h4>
                  <p className="text-[0.82rem] text-text-soft mt-0.5">{contact?.phone || "+91 99105 19242"}{contact?.whatsapp ? ` · WhatsApp: ${contact.whatsapp}` : ""}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cream-dark rounded-sm flex items-center justify-center text-rose-deep shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-[0.88rem] font-semibold text-chocolate">Email Us</h4>
                  <p className="text-[0.82rem] text-text-soft mt-0.5">{contact?.email || "hello@thecakelounge.in"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-[44px_40px] shadow-md border border-cream">
            <h3 className="mb-6 text-[1.4rem] text-chocolate font-bold">Send a Message</h3>
            <form className="flex flex-col gap-[22px]">
              <div className="flex flex-col gap-2">
                <label className="text-[0.82rem] font-semibold text-text-mid">Your Name</label>
                <input type="text" placeholder="e.g. Priya Sharma" className="w-full p-[14px_18px] border-2 border-cream-dark rounded-sm font-poppins text-[0.88rem] text-text bg-cream outline-none transition-all focus:border-rose focus:shadow-[0_0_0_3px_rgba(232,145,122,0.15)]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.82rem] font-semibold text-text-mid">Email Address</label>
                <input type="email" placeholder="you@example.com" className="w-full p-[14px_18px] border-2 border-cream-dark rounded-sm font-poppins text-[0.88rem] text-text bg-cream outline-none transition-all focus:border-rose focus:shadow-[0_0_0_3px_rgba(232,145,122,0.15)]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.82rem] font-semibold text-text-mid">Phone (optional)</label>
                <input type="tel" placeholder="+91 98765 43210" className="w-full p-[14px_18px] border-2 border-cream-dark rounded-sm font-poppins text-[0.88rem] text-text bg-cream outline-none transition-all focus:border-rose focus:shadow-[0_0_0_3px_rgba(232,145,122,0.15)]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.82rem] font-semibold text-text-mid">Your Message</label>
                <textarea placeholder="Tell us about your dream cake..." className="w-full h-[120px] p-[14px_18px] border-2 border-cream-dark rounded-sm font-poppins text-[0.88rem] text-text bg-cream outline-none resize-none transition-all focus:border-rose focus:shadow-[0_0_0_3px_rgba(232,145,122,0.15)]"></textarea>
              </div>
              <button type="submit" className="w-full p-[15px] bg-rose-deep text-white border-none rounded-[50px] font-poppins text-[0.95rem] font-semibold cursor-pointer transition-all duration-350 flex items-center justify-center gap-2 hover:bg-brown hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(107,58,42,0.3)]">
                <Send size={18} /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
