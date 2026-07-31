import { redirect } from 'next/navigation';

export default function ProfileOrdersRedirect() {
  redirect('/orders');
}
