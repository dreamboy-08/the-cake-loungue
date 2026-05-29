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
    href: "/menu#cakes",
    columns: [
      {
        title: "Category",
        items: [
          { label: "Birthday Cakes", href: "/menu#birthday-cakes" },
          { label: "Wedding Cakes", href: "/menu#wedding-cakes" },
          { label: "Anniversary Cakes", href: "/menu#anniversary-cakes" },
          { label: "Bento Cakes", href: "/menu#bento-cakes" },
          { label: "Theme Cakes", href: "/menu#theme-cakes" },
          { label: "Photo Cakes", href: "/menu#photo-cakes" },
        ]
      },
      {
        title: "Designer",
        items: [
          { label: "Designer Cakes", href: "/menu#designer-cakes" },
          { label: "Fondant Cakes", href: "/menu#designer-cakes" },
          { label: "Tier Cakes", href: "/menu#wedding-cakes" },
          { label: "Half Cakes", href: "/menu#custom-cakes" },
        ]
      },
      {
        title: "Flavours",
        items: [
          { label: "Chocolate Cakes", href: "/menu#chocolate-cakes" },
          { label: "Vanilla Cakes", href: "/menu#vanilla-cakes" },
          { label: "Pineapple Cakes", href: "/menu#fruit-cakes" },
          { label: "Oreo Cakes", href: "/menu#trending-cakes" },
          { label: "Kitkat Cakes", href: "/menu#trending-cakes" },
        ]
      },
      {
        title: "Occasions",
        items: [
          { label: "Birthday Cakes", href: "/menu#birthday-cakes" },
          { label: "Wedding Cakes", href: "/menu#wedding-cakes" },
          { label: "Anniversary Cakes", href: "/menu#anniversary-cakes" },
          { label: "Baby Shower Cakes", href: "/menu#baby-shower-cakes" },
        ]
      }
    ]
  },
  {
    label: "Bento",
    href: "/menu#bento-cakes",
    columns: [
      {
        title: "Bento Cakes",
        items: [
          { label: "Mini Bento Cakes", href: "/menu#bento-cakes" },
          { label: "Korean Bento Cakes", href: "/menu#korean-cakes" },
          { label: "Cute Bento Cakes", href: "/menu#kids-cakes" },
          { label: "Heart Bento Cakes", href: "/menu#heart-cakes" },
          { label: "Funny Bento Cakes", href: "/menu#cartoon-cakes" },
        ]
      },
      {
        title: "Designs",
        items: [
          { label: "Cartoon Bento", href: "/menu#cartoon-cakes" },
          { label: "Pastel Bento", href: "/menu#minimal-cakes" },
          { label: "Minimal Bento", href: "/menu#minimal-cakes" },
          { label: "Chocolate Bento", href: "/menu#chocolate-cakes" },
        ]
      },
      {
        title: "Flavours",
        items: [
          { label: "Chocolate", href: "/menu#chocolate-cakes" },
          { label: "Red Velvet", href: "/menu#red-velvet-cakes" },
          { label: "Vanilla", href: "/menu#vanilla-cakes" },
          { label: "Strawberry", href: "/menu#fruit-cakes" },
        ]
      },
      {
        title: "Combos",
        items: [
          { label: "Bento + Cupcakes", href: "/menu#cupcakes" },
          { label: "Bento + Flowers", href: "/menu#bakery-hampers" },
          { label: "Bento Gift Box", href: "/menu#bakery-hampers" },
        ]
      }
    ]
  },
  {
    label: "Theme Cakes",
    href: "/menu#theme-cakes",
    columns: [
      {
        title: "Kids Cakes",
        items: [
          { label: "Cocomelon Cakes", href: "/menu#kids-cakes" },
          { label: "Frozen Cakes", href: "/menu#kids-cakes" },
          { label: "Unicorn Cakes", href: "/menu#kids-cakes" },
          { label: "Baby Shark Cakes", href: "/menu#kids-cakes" },
          { label: "Peppa Pig Cakes", href: "/menu#kids-cakes" },
        ]
      },
      {
        title: "Character Cakes",
        items: [
          { label: "Spiderman Cakes", href: "/menu#cartoon-cakes" },
          { label: "Batman Cakes", href: "/menu#cartoon-cakes" },
          { label: "Naruto Cakes", href: "/menu#anime-cakes" },
          { label: "Pokemon Cakes", href: "/menu#anime-cakes" },
          { label: "Avengers Cakes", href: "/menu#superhero-cakes" },
        ]
      },
      {
        title: "Girls Cakes",
        items: [
          { label: "Barbie Cakes", href: "/menu#romantic-cakes" },
          { label: "Princess Cakes", href: "/menu#romantic-cakes" },
          { label: "Butterfly Cakes", href: "/menu#romantic-cakes" },
          { label: "Pink Theme Cakes", href: "/menu#romantic-cakes" },
        ]
      },
      {
        title: "Boys Cakes",
        items: [
          { label: "Car Cakes", href: "/menu#superhero-cakes" },
          { label: "Football Cakes", href: "/menu#superhero-cakes" },
          { label: "Cricket Cakes", href: "/menu#superhero-cakes" },
          { label: "Bike Cakes", href: "/menu#superhero-cakes" },
        ]
      }
    ]
  },
  {
    label: "By Relationship",
    href: "/menu#couple-cakes",
    columns: [
      {
        title: "Family",
        items: [
          { label: "Mom Cakes", href: "/menu#mothers-day-cakes" },
          { label: "Dad Cakes", href: "/menu#fathers-day-cakes" },
          { label: "Brother Cakes", href: "/menu#custom-cakes" },
          { label: "Sister Cakes", href: "/menu#custom-cakes" },
        ]
      },
      {
        title: "Couples",
        items: [
          { label: "Husband Cakes", href: "/menu#couple-cakes" },
          { label: "Wife Cakes", href: "/menu#couple-cakes" },
          { label: "Boyfriend Cakes", href: "/menu#couple-cakes" },
          { label: "Girlfriend Cakes", href: "/menu#couple-cakes" },
        ]
      },
      {
        title: "Friends",
        items: [
          { label: "Best Friend Cakes", href: "/menu#friendship-cakes" },
          { label: "Friendship Cakes", href: "/menu#friendship-cakes" },
          { label: "Funny Cakes", href: "/menu#cartoon-cakes" },
        ]
      },
      {
        title: "Special",
        items: [
          { label: "Love Cakes", href: "/menu#romantic-cakes" },
          { label: "Miss You Cakes", href: "/menu#romantic-cakes" },
          { label: "Thank You Cakes", href: "/menu#romantic-cakes" },
        ]
      }
    ]
  },
  {
    label: "Desserts",
    href: "/menu#dessert-boxes",
    columns: [
      {
        title: "Desserts",
        items: [
          { label: "Cupcakes", href: "/menu#cupcakes" },
          { label: "Brownies", href: "/menu#brownies" },
          { label: "Pastries", href: "/menu#pastries" },
          { label: "Jar Cakes", href: "/menu#jar-cakes" },
        ]
      },
      {
        title: "Hampers",
        items: [
          { label: "Chocolate Hampers", href: "/menu#bakery-hampers" },
          { label: "Cake Hampers", href: "/menu#bakery-hampers" },
          { label: "Gift Boxes", href: "/menu#bakery-hampers" },
        ]
      },
      {
        title: "Combos",
        items: [
          { label: "Cake + Flowers", href: "/menu#bakery-hampers" },
          { label: "Cake + Teddy", href: "/menu#bakery-hampers" },
          { label: "Cake + Chocolates", href: "/menu#bakery-hampers" },
        ]
      },
      {
        title: "Premium",
        items: [
          { label: "Luxury Hampers", href: "/menu#luxury-cakes" },
          { label: "Custom Gifts", href: "/menu#custom-cakes" },
          { label: "Festival Hampers", href: "/menu#festival-cakes" },
        ]
      }
    ]
  },
  {
    label: "Birthday",
    href: "/menu#birthday-cakes",
    columns: [
      {
        title: "Birthday Cakes",
        items: [
          { label: "Kids Birthday Cakes", href: "/menu#kids-cakes" },
          { label: "Adult Cakes", href: "/menu#premium-cakes" },
          { label: "Photo Cakes", href: "/menu#photo-cakes" },
          { label: "Number Cakes", href: "/menu#custom-cakes" },
        ]
      },
      {
        title: "Trending",
        items: [
          { label: "Pinata Cakes", href: "/menu#pinata-cakes" },
          { label: "Bomb Cakes", href: "/menu#bomb-cakes" },
          { label: "Pull Me Up Cakes", href: "/menu#pull-me-up-cakes" },
        ]
      },
      {
        title: "Flavours",
        items: [
          { label: "Chocolate", href: "/menu#chocolate-cakes" },
          { label: "Black Forest", href: "/menu#black-forest-cakes" },
          { label: "Red Velvet", href: "/menu#red-velvet-cakes" },
        ]
      },
      {
        title: "Combos",
        items: [
          { label: "Cake + Balloons", href: "/menu#bakery-hampers" },
          { label: "Cake + Gifts", href: "/menu#bakery-hampers" },
          { label: "Cake + Flowers", href: "/menu#bakery-hampers" },
        ]
      }
    ]
  },
  {
    label: "Anniversary",
    href: "/menu#anniversary-cakes",
    columns: [
      {
        title: "Romantic Cakes",
        items: [
          { label: "Heart Cakes", href: "/menu#heart-cakes" },
          { label: "Red Velvet Cakes", href: "/menu#red-velvet-cakes" },
          { label: "Rose Cakes", href: "/menu#romantic-cakes" },
        ]
      },
      {
        title: "Designer",
        items: [
          { label: "Tier Cakes", href: "/menu#wedding-cakes" },
          { label: "Photo Cakes", href: "/menu#photo-cakes" },
          { label: "Fondant Cakes", href: "/menu#designer-cakes" },
        ]
      },
      {
        title: "Special Gifts",
        items: [
          { label: "Cake + Flowers", href: "/menu#bakery-hampers" },
          { label: "Cake + Chocolates", href: "/menu#bakery-hampers" },
          { label: "Gift Hampers", href: "/menu#bakery-hampers" },
        ]
      }
    ]
  }
];
