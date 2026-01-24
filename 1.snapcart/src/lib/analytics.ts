// Google Analytics Event Tracking Helpers

declare global {
    interface Window {
        gtag?: (
            command: string,
            targetId: string,
            config?: Record<string, any>
        ) => void;
    }
}

// Track page views
export const pageview = (url: string) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
            page_path: url,
        })
    }
}

// Track custom events
export const event = ({
    action,
    category,
    label,
    value,
}: {
    action: string
    category: string
    label?: string
    value?: number
}) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        })
    }
}

// E-commerce tracking events
export const trackPurchase = ({
    transactionId,
    value,
    currency = 'INR',
    items,
}: {
    transactionId: string
    value: number
    currency?: string
    items: Array<{
        item_id: string
        item_name: string
        price: number
        quantity: number
    }>
}) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'purchase', {
            transaction_id: transactionId,
            value: value,
            currency: currency,
            items: items,
        })
    }
}

export const trackAddToCart = ({
    itemId,
    itemName,
    price,
    quantity,
}: {
    itemId: string
    itemName: string
    price: number
    quantity: number
}) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'add_to_cart', {
            currency: 'INR',
            value: price * quantity,
            items: [
                {
                    item_id: itemId,
                    item_name: itemName,
                    price: price,
                    quantity: quantity,
                },
            ],
        })
    }
}

export const trackBeginCheckout = ({
    value,
    items,
}: {
    value: number
    items: Array<{
        item_id: string
        item_name: string
        price: number
        quantity: number
    }>
}) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'begin_checkout', {
            currency: 'INR',
            value: value,
            items: items,
        })
    }
}

// Google Ads conversion tracking
export const trackConversion = (conversionLabel: string, value?: number) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'conversion', {
            send_to: `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/${conversionLabel}`,
            value: value,
            currency: 'INR',
        })
    }
}

// Track farmer signup
export const trackFarmerSignup = () => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'sign_up', {
            method: 'Farmer Registration',
        })
    }
}

// Track product view
export const trackProductView = ({
    itemId,
    itemName,
    price,
    category,
}: {
    itemId: string
    itemName: string
    price: number
    category: string
}) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'view_item', {
            currency: 'INR',
            value: price,
            items: [
                {
                    item_id: itemId,
                    item_name: itemName,
                    price: price,
                    item_category: category,
                },
            ],
        })
    }
}

export default { pageview, event, trackPurchase, trackAddToCart, trackBeginCheckout, trackConversion, trackFarmerSignup, trackProductView }
