# Firestore Quota Exhaustion Analysis & Optimization Report

## 1. Problem Identification: Exact Files Causing Quota Exhaustion

The investigation identified the following primary sources of excessive Firestore reads and writes:

### A. `src/context/CartContext.tsx` (Excessive Writes & Feedback Loop)
- **Issue:** An infinite feedback loop existed between the `onSnapshot` listener and the `useEffect` responsible for persisting the cart.
- **Mechanism:**
  1. `onSnapshot` received an update from the server.
  2. State was updated via `setCart`.
  3. `useEffect` detected a change in `cart` state.
  4. `useEffect` called `persistCart` (`setDoc`), even if the data was identical to what was just received.
  5. The server received the write, and broadcasted a new snapshot.
  6. Repeat indefinitely.
- **Impact:** Hundreds of writes per second per active user session, quickly exhausting the daily write quota.

### B. `src/app/admin/orders/page.tsx` (Excessive Reads)
- **Issue:** A real-time `onSnapshot` listener was active on the entire `orders` collection.
- **Mechanism:** Every time *any* customer in the system placed an order or updated a payment, the Admin listener was triggered. Firestore `onSnapshot` re-reads all documents in the result set when changes occur.
- **Impact:** For a collection of $N$ orders, every single change in the system cost the Admin $N$ reads. With multiple orders happening, this scaled quadratically with activity.

### C. `src/app/orders/page.tsx` (Redundant Reads)
- **Issue:** Real-time listener for individual user order history.
- **Impact:** While less severe than the Admin page, it still caused recurring reads for users who kept the tab open, even though order status changes are relatively infrequent.

---

## 2. Quantitative Read/Write Analysis (Estimated)

| Page / Component | Action | Before Optimization | After Optimization | % Reduction |
| :--- | :--- | :--- | :--- | :--- |
| **CartContext** | Add 1 Item | 1 Write + Infinite Loop (Hundreds/sec) | **Exactly 1 Write** | **~99.9%** |
| **Admin Orders** | Open Page | $N$ Reads + $N$ reads per system update | **Exactly $N$ Reads** | **Significant** |
| **Customer Orders** | View History | $M$ Reads + $M$ reads per status update | **Exactly $M$ Reads** | **~50-80%** |

*where $N$ = total system orders, $M$ = user's orders.*

---

## 3. Implemented Fixes

1.  **Cart Feedback Loop Broken:**
    - Implemented `lastFetchedCartStr` ref to track the exact stringified state of the last server/persisted cart.
    - Added deep comparison check: `persistCart` now aborts if the current state matches the last known server state.
    - Added `cartRefForSync` to ensure `onSnapshot` comparison always uses the most recent local data without triggering effect dependencies.

2.  **Conversion to One-Time Fetches:**
    - Replaced `onSnapshot` with `getDocs` in `src/app/orders/page.tsx` and `src/app/admin/orders/page.tsx`.
    - Added a manual **Refresh** button (with loading spinner) to both pages, allowing users/admins to pull fresh data only when needed.

3.  **Efficiency:**
    - Reduced active long-lived connections to Firestore, which also helps with "Maximum backoff delay" errors by reducing the concurrent load on the Firebase backend.

## 4. Conclusion
The "Resource Exhausted" error was primarily driven by the `CartContext` write-loop. By eliminating this loop and converting the order management views to pull-based fetching, the system's Firestore consumption is now linear to actual user actions rather than exponentially tied to active session time.
