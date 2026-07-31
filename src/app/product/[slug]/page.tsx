import { redirect } from 'next/navigation';
import { products } from '@/constants/products';
import { toSlug } from '@/utils/slug';

interface ProductRedirectProps {
  params: {
    slug: string;
  };
}

export default function ProductRedirect({ params }: ProductRedirectProps) {
  const { slug } = params;

  // Find product by comparing slugified name with URL parameter
  const product = products.find(p => toSlug(p.name) === slug);

  if (product) {
    redirect(`/shop/${product.id}`);
  } else {
    redirect('/shop');
  }
}
