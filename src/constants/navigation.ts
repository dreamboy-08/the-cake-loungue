export interface MegaSubItem {
  label: string;
  href: string;
}

export interface MegaColumn {
  title: string;
  items: MegaSubItem[];
}

export interface MegaMenuItem {
  label: string;
  href: string;
  columns?: MegaColumn[];
}

export const MEGA_MENU: MegaMenuItem[] = [
  {
    label: "Cakes",
    href: "/menu",
    columns: [
      {
        title: "Category",
        items: [
          { label: "Birthday Cakes", href: "/menu?category=birthday-cakes" },
          { label: "Wedding Cakes", href: "/menu?category=wedding-cakes" },
          { label: "Anniversary Cakes", href: "/menu?category=anniversary-cakes" },
          { label: "Bento Cakes", href: "/menu?category=bento-cakes" },
          { label: "Theme Cakes", href: "/menu?category=theme-cakes" },
          { label: "Photo Cakes", href: "/menu?category=photo-cakes" },
        ]
      },
      {
        title: "Designer",
        items: [
          { label: "Designer Cakes", href: "/menu?category=designer-cakes" },
          { label: "Fondant Cakes", href: "/menu?category=designer-cakes" },
          { label: "Tier Cakes", href: "/menu?category=wedding-cakes" },
          { label: "Half Cakes", href: "/menu?category=custom-cakes" },
        ]
      },
      {
        title: "Flavours",
        items: [
          { label: "Chocolate Cakes", href: "/menu?category=chocolate-cakes" },
          { label: "Vanilla Cakes", href: "/menu?category=vanilla-cakes" },
          { label: "Pineapple Cakes", href: "/menu?category=fruit-cakes" },
          { label: "Oreo Cakes", href: "/menu?category=trending-cakes" },
          { label: "Kitkat Cakes", href: "/menu?category=trending-cakes" },
        ]
      },
      {
        title: "Occasions",
        items: [
          { label: "Birthday Cakes", href: "/menu?category=birthday-cakes" },
          { label: "Wedding Cakes", href: "/menu?category=wedding-cakes" },
          { label: "Anniversary Cakes", href: "/menu?category=anniversary-cakes" },
          { label: "Baby Shower Cakes", href: "/menu?category=baby-shower-cakes" },
        ]
      }
    ]
  },
  {
    label: "Bento",
    href: "/menu?category=bento-cakes",
    columns: [
      {
        title: "Bento Cakes",
        items: [
          { label: "Mini Bento Cakes", href: "/menu?category=bento-cakes" },
          { label: "Korean Bento Cakes", href: "/menu?category=korean-cakes" },
          { label: "Cute Bento Cakes", href: "/menu?category=kids-cakes" },
          { label: "Heart Bento Cakes", href: "/menu?category=heart-cakes" },
          { label: "Funny Bento Cakes", href: "/menu?category=cartoon-cakes" },
        ]
      },
      {
        title: "Designs",
        items: [
          { label: "Cartoon Bento", href: "/menu?category=cartoon-cakes" },
          { label: "Pastel Bento", href: "/menu?category=minimal-cakes" },
          { label: "Minimal Bento", href: "/menu?category=minimal-cakes" },
          { label: "Chocolate Bento", href: "/menu?category=chocolate-cakes" },
        ]
      },
      {
        title: "Flavours",
        items: [
          { label: "Chocolate", href: "/menu?category=chocolate-cakes" },
          { label: "Red Velvet", href: "/menu?category=red-velvet-cakes" },
          { label: "Vanilla", href: "/menu?category=vanilla-cakes" },
          { label: "Strawberry", href: "/menu?category=fruit-cakes" },
        ]
      },
      {
        title: "Combos",
        items: [
          { label: "Bento + Cupcakes", href: "/menu?category=cupcakes" },
          { label: "Bento + Flowers", href: "/menu?category=bakery-hampers" },
          { label: "Bento Gift Box", href: "/menu?category=bakery-hampers" },
        ]
      }
    ]
  },
  {
    label: "Theme Cakes",
    href: "/menu?category=theme-cakes",
    columns: [
      {
        title: "Kids Cakes",
        items: [
          { label: "Cocomelon Cakes", href: "/menu?category=kids-cakes" },
          { label: "Frozen Cakes", href: "/menu?category=kids-cakes" },
          { label: "Unicorn Cakes", href: "/menu?category=kids-cakes" },
          { label: "Baby Shark Cakes", href: "/menu?category=kids-cakes" },
          { label: "Peppa Pig Cakes", href: "/menu?category=kids-cakes" },
        ]
      },
      {
        title: "Character Cakes",
        items: [
          { label: "Spiderman Cakes", href: "/menu?category=cartoon-cakes" },
          { label: "Batman Cakes", href: "/menu?category=cartoon-cakes" },
          { label: "Naruto Cakes", href: "/menu?category=anime-cakes" },
          { label: "Pokemon Cakes", href: "/menu?category=anime-cakes" },
          { label: "Avengers Cakes", href: "/menu?category=superhero-cakes" },
        ]
      },
      {
        title: "Girls Cakes",
        items: [
          { label: "Barbie Cakes", href: "/menu?category=romantic-cakes" },
          { label: "Princess Cakes", href: "/menu?category=romantic-cakes" },
          { label: "Butterfly Cakes", href: "/menu?category=romantic-cakes" },
          { label: "Pink Theme Cakes", href: "/menu?category=romantic-cakes" },
        ]
      },
      {
        title: "Boys Cakes",
        items: [
          { label: "Car Cakes", href: "/menu?category=superhero-cakes" },
          { label: "Football Cakes", href: "/menu?category=superhero-cakes" },
          { label: "Cricket Cakes", href: "/menu?category=superhero-cakes" },
          { label: "Bike Cakes", href: "/menu?category=superhero-cakes" },
        ]
      }
    ]
  },
  {
    label: "By Relationship",
    href: "/menu?category=couple-cakes",
    columns: [
      {
        title: "Family",
        items: [
          { label: "Mom Cakes", href: "/menu?category=mothers-day-cakes" },
          { label: "Dad Cakes", href: "/menu?category=fathers-day-cakes" },
          { label: "Brother Cakes", href: "/menu?category=custom-cakes" },
          { label: "Sister Cakes", href: "/menu?category=custom-cakes" },
        ]
      },
      {
        title: "Couples",
        items: [
          { label: "Husband Cakes", href: "/menu?category=couple-cakes" },
          { label: "Wife Cakes", href: "/menu?category=couple-cakes" },
          { label: "Boyfriend Cakes", href: "/menu?category=couple-cakes" },
          { label: "Girlfriend Cakes", href: "/menu?category=couple-cakes" },
        ]
      },
      {
        title: "Friends",
        items: [
          { label: "Best Friend Cakes", href: "/menu?category=friendship-cakes" },
          { label: "Friendship Cakes", href: "/menu?category=friendship-cakes" },
          { label: "Funny Cakes", href: "/menu?category=cartoon-cakes" },
        ]
      },
      {
        title: "Special",
        items: [
          { label: "Love Cakes", href: "/menu?category=romantic-cakes" },
          { label: "Miss You Cakes", href: "/menu?category=romantic-cakes" },
          { label: "Thank You Cakes", href: "/menu?category=romantic-cakes" },
        ]
      }
    ]
  },
  {
    label: "Desserts",
    href: "/menu?category=dessert-boxes",
    columns: [
      {
        title: "Desserts",
        items: [
          { label: "Cupcakes", href: "/menu?category=cupcakes" },
          { label: "Brownies", href: "/menu?category=brownies" },
          { label: "Pastries", href: "/menu?category=pastries" },
          { label: "Jar Cakes", href: "/menu?category=jar-cakes" },
        ]
      },
      {
        title: "Hampers",
        items: [
          { label: "Chocolate Hampers", href: "/menu?category=bakery-hampers" },
          { label: "Cake Hampers", href: "/menu?category=bakery-hampers" },
          { label: "Gift Boxes", href: "/menu?category=bakery-hampers" },
        ]
      },
      {
        title: "Combos",
        items: [
          { label: "Cake + Flowers", href: "/menu?category=bakery-hampers" },
          { label: "Cake + Teddy", href: "/menu?category=bakery-hampers" },
          { label: "Cake + Chocolates", href: "/menu?category=bakery-hampers" },
        ]
      },
      {
        title: "Premium",
        items: [
          { label: "Luxury Hampers", href: "/menu?category=luxury-cakes" },
          { label: "Custom Gifts", href: "/menu?category=custom-cakes" },
          { label: "Festival Hampers", href: "/menu?category=festival-cakes" },
        ]
      }
    ]
  },
  {
    label: "Birthday",
    href: "/menu?category=birthday-cakes",
    columns: [
      {
        title: "Birthday Cakes",
        items: [
          { label: "Kids Birthday Cakes", href: "/menu?category=kids-cakes" },
          { label: "Adult Cakes", href: "/menu?category=premium-cakes" },
          { label: "Photo Cakes", href: "/menu?category=photo-cakes" },
          { label: "Number Cakes", href: "/menu?category=custom-cakes" },
        ]
      },
      {
        title: "Trending",
        items: [
          { label: "Pinata Cakes", href: "/menu?category=pinata-cakes" },
          { label: "Bomb Cakes", href: "/menu?category=bomb-cakes" },
          { label: "Pull Me Up Cakes", href: "/menu?category=pull-me-up-cakes" },
        ]
      },
      {
        title: "Flavours",
        items: [
          { label: "Chocolate", href: "/menu?category=chocolate-cakes" },
          { label: "Black Forest", href: "/menu?category=black-forest-cakes" },
          { label: "Red Velvet", href: "/menu?category=red-velvet-cakes" },
        ]
      },
      {
        title: "Combos",
        items: [
          { label: "Cake + Balloons", href: "/menu?category=bakery-hampers" },
          { label: "Cake + Gifts", href: "/menu?category=bakery-hampers" },
          { label: "Cake + Flowers", href: "/menu?category=bakery-hampers" },
        ]
      }
    ]
  },
  {
    label: "Anniversary",
    href: "/menu?category=anniversary-cakes",
    columns: [
      {
        title: "Romantic Cakes",
        items: [
          { label: "Heart Cakes", href: "/menu?category=heart-cakes" },
          { label: "Red Velvet Cakes", href: "/menu?category=red-velvet-cakes" },
          { label: "Rose Cakes", href: "/menu?category=romantic-cakes" },
        ]
      },
      {
        title: "Designer",
        items: [
          { label: "Tier Cakes", href: "/menu?category=wedding-cakes" },
          { label: "Photo Cakes", href: "/menu?category=photo-cakes" },
          { label: "Fondant Cakes", href: "/menu?category=designer-cakes" },
        ]
      },
      {
        title: "Special Gifts",
        items: [
          { label: "Cake + Flowers", href: "/menu?category=bakery-hampers" },
          { label: "Cake + Chocolates", href: "/menu?category=bakery-hampers" },
          { label: "Gift Hampers", href: "/menu?category=bakery-hampers" },
        ]
      }
    ]
  }
];
