// src/core/state.js
// Shared mutable UI state (single instance imported by the UI modules).

export const State = {
    category: 'all',
    searchQuery: '',
    openDropdownId: null,
    prescriptionList: []
};

/** Whether the user has an active premium entitlement (from the Android bridge). */
export function isPremiumUser() {
    if (typeof window !== 'undefined' && typeof window.Android !== 'undefined' && window.Android.isPremium) {
        try {
            return !!window.Android.isPremium();
        } catch {
            return false;
        }
    }
    return false;
}
