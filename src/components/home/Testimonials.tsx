import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

const Testimonials = ({ content }: { content?: any[] }) => {
  const defaultReviews = [
    {
      name: "Priya Sharma",
      tag: "Loyal Customer · 3 yrs",
      avatar: "https://i.pravatar.cc/100?img=47",
      text: "Ordered a custom birthday cake for my daughter and I was absolutely blown away. The attention to detail was incredible — it looked exactly like the design I requested, and it tasted even better!",
      rating: 5,
    },
    {
      name: "Rohan Mehta",
      tag: "Verified Buyer",
      avatar: "https://i.pravatar.cc/100?img=12",
      text: "The Belgian chocolate truffle cake was an absolute showstopper at our anniversary dinner. Our guests couldn't stop talking about it. Delivery was on time and packaging was beautiful!",
      rating: 5,
    },
    {
      name: "Ananya Kapoor",
      tag: "Premium Member",
      avatar: "https://i.pravatar.cc/100?img=32",
      text: "I've ordered from La Douceur 5 times now — red velvet, mango mousse, tiramisu — every single one is perfection. This is my go-to bakery for every celebration!",
      rating: 4.5,
    },
  ];

  const reviews = content && content.length > 0 ? content.map(t => ({
    name: t.name,
    tag: t.role,
    avatar: `https://i.pravatar.cc/100?u=${t.name}`,
    text: t.text,
    rating: t.rating || 5
  })) : defaultReviews;

  return (
    <section id="testimonials" className="py-[100px] bg-cream-dark">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <p className="section-label">Happy Customers</p>
          <h2 className="section-title">What People Are Saying</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-[50px]">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white rounded-md p-8 shadow-sm transition-all duration-350 relative hover:translate-y-[-6px] hover:shadow-md before:content-['\201C'] before:font-playfair before:text-[6rem] before:text-cream-dark before:absolute before:top-2.5 before:left-5 before:leading-none">
              <div className="flex gap-[3px] text-gold text-[0.9rem] mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} fill={j < Math.floor(review.rating) ? "currentColor" : "none"} className={j < Math.floor(review.rating) ? "text-gold" : "text-text-soft/30"} />
                ))}
              </div>
              <p className="text-[0.9rem] text-text-mid leading-[1.75] relative z-10 mb-6">
                &quot;{review.text}&quot;
              </p>
              <div className="flex items-center gap-[14px]">
                <div className="w-[46px] h-[46px] rounded-full overflow-hidden border-2 border-blush relative">
                  <Image src={review.avatar} alt={review.name} fill sizes="46px" className="object-cover" />
                </div>
                <div>
                  <div className="text-[0.9rem] font-semibold text-chocolate">{review.name}</div>
                  <div className="text-[0.75rem] text-text-soft">{review.tag}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
