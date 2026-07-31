"use client";

import React, { Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import BackButton from '@/components/BackButton';
import PageWrapper from '@/components/PageWrapper';
import AddressManager from '@/components/shop/AddressManager';

const AddressesPageContent = () => {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const isBypass = searchParams?.get('bypass') === 'true';

  if (!user && !loading && !isBypass) {
    return (
      <PageWrapper loading className="px-6 text-center">
        <h2 className="text-2xl font-bold text-chocolate mb-4">Please log in</h2>
        <Link href="/login" className="bg-rose-deep text-white px-8 py-3 rounded-full font-bold shadow-lg">
          Log In / Sign Up
        </Link>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="container mx-auto px-6 max-w-4xl">
        <BackButton fallbackRoute="/profile" ariaLabel="Go back to profile" />

        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-cream">
          <AddressManager />
        </div>
      </div>
    </PageWrapper>
  );
};

const AddressesPage = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-deep"></div>
      </div>
    }>
      <AddressesPageContent />
    </Suspense>
  );
};

export default AddressesPage;
