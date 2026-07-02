"use client";
import ProductForm from '@/components/admin/ProductForm';

export default function TestPage() {
  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <ProductForm
        onClose={() => console.log('closed')}
        onSuccess={() => console.log('success')}
      />
    </div>
  );
}
