// Site configuration
export const siteConfig = {
    name: "AgenticForce",
    description: "Leading to agentic era with agentic AI solutions, ERP automation, academy training, and AI intelligence.",
    url: "https://agenticforce.com",

    // Navigation links
    navLinks: [
        { label: "Services", href: "#services" },
        { label: "Academy", href: "#academy" },
        { label: "Articles", href: "#articles" },
    ],

    // Product dropdown items
    productItems: [
        "Agentic AI Consulting",
        "Agentic ERP",
        "Workflow Automation",
        "Hermes News Ops",
    ],

    // Solutions dropdown items
    solutionItems: [
        "For Enterprises",
        "For ERP Teams",
        "For AI Teams",
        "For Academy Learners",
    ],

    // Footer links
    footerLinks: {
        product: [
            { label: "Features", href: "#" },
            { label: "Pricing", href: "#" },
            { label: "Integrations", href: "#" },
            { label: "Roadmap", href: "#" },
            { label: "Changelog", href: "#" },
        ],
        company: [
            { label: "About", href: "#" },
            { label: "Blog", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Customers", href: "#" },
            { label: "Contact", href: "#" },
        ],
        resources: [
            { label: "Documentation", href: "#" },
            { label: "Help Center", href: "#" },
            { label: "API Reference", href: "#" },
            { label: "Community", href: "#" },
            { label: "Status", href: "#" },
        ],
        legal: [
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
            { label: "Cookie Policy", href: "#" },
        ],
    },

    // Social links
    socialLinks: [
        { name: "Twitter", href: "#" },
        { name: "Facebook", href: "#" },
        { name: "Instagram", href: "#" },
        { name: "LinkedIn", href: "#" },
        { name: "GitHub", href: "#" },
    ],
}

export type SiteConfig = typeof siteConfig
