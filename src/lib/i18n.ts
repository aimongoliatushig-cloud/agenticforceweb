export const locales = ["en", "mn"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "mn";
}

export function normalizeLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : "en";
}

export const dictionary = {
  en: {
    nav: {
      services: "Services",
      academy: "Academy",
      articles: "Articles",
      quote: "Request quote",
      admin: "CRM",
      signIn: "Sign in",
      signUp: "Join free",
    },
    hero: {
      badge: "Agentic AI solutions for modern teams",
      title: "Leading to agentic era",
      description:
        "AgenticForce builds AI agents, agentic ERP workflows, and practical training programs that help organizations move from automation ideas to measurable operations.",
      primaryCta: "Request a quote",
      secondaryCta: "Explore articles",
      statOne: "Agentic ERP",
      statTwo: "AI Academy",
      statThree: "Hermes News Ops",
    },
    services: {
      title: "Services built for agentic operations",
      subtitle:
        "We combine business process design, AI agent engineering, and integration delivery so your teams can work with reliable digital operators.",
    },
    academy: {
      title: "AgenticForce Academy",
      subtitle:
        "Train analysts, developers, managers, and operators to design, govern, and maintain agentic AI systems.",
    },
    articles: {
      title: "AI intelligence and AgenticForce insights",
      subtitle:
        "Original guides and reviewed Hermes drafts from trusted AI sources, published in Mongolian and English.",
      viewAll: "View all articles",
      gatedTitle: "Create a free account to continue",
      gatedBody:
        "Unsigned readers can preview the first half. Join free with Google or Facebook to read the full article.",
    },
    quote: {
      title: "Tell us what you want to automate",
      subtitle:
        "Send a short request and we will map the right agentic AI, ERP, or academy path for your team.",
      name: "Name",
      company: "Company",
      email: "Email",
      service: "Service interest",
      message: "What should AgenticForce help with?",
      submit: "Send request",
    },
    newsletter: {
      title: "Weekly agentic AI brief",
      subtitle:
        "Get top reviewed AI news and AgenticForce analysis in your preferred language.",
      email: "Email address",
      consent: "I agree to receive the AgenticForce newsletter.",
      submit: "Subscribe",
    },
    admin: {
      title: "AgenticForce CRM",
      subtitle:
        "Registered users, subscribers, quote leads, article drafts, and behavior analytics.",
      locked: "Admin access is restricted.",
    },
  },
  mn: {
    nav: {
      services: "Үйлчилгээ",
      academy: "Академи",
      articles: "Нийтлэл",
      quote: "Үнийн санал",
      admin: "CRM",
      signIn: "Нэвтрэх",
      signUp: "Үнэгүй бүртгүүлэх",
    },
    hero: {
      badge: "Орчин үеийн багт зориулсан agentic AI шийдэл",
      title: "Leading to agentic era",
      description:
        "AgenticForce нь AI агент, agentic ERP урсгал, бодит сургалтын хөтөлбөрүүдийг бүтээж байгууллагуудыг санаанаас хэмжигдэхүйц ажиллагаа руу шилжүүлнэ.",
      primaryCta: "Үнийн санал авах",
      secondaryCta: "Нийтлэл үзэх",
      statOne: "Agentic ERP",
      statTwo: "AI академи",
      statThree: "Hermes мэдээ",
    },
    services: {
      title: "Agentic ажиллагаанд зориулсан үйлчилгээ",
      subtitle:
        "Бизнес процесс, AI агент инженерчлэл, интеграцийн хэрэгжилтийг нэгтгэн найдвартай дижитал операторуудыг бий болгоно.",
    },
    academy: {
      title: "AgenticForce Академи",
      subtitle:
        "Agentic AI системийг загварчлах, удирдах, хөгжүүлэх чадвартай мэргэжилтэн, менежер, операторуудыг бэлтгэнэ.",
    },
    articles: {
      title: "AI мэдээ ба AgenticForce нийтлэл",
      subtitle:
        "Эх нийтлэлүүд болон Hermes-ийн шалгагдсан AI мэдээний тоймуудыг Монгол, Англи хэлээр хүргэнэ.",
      viewAll: "Бүх нийтлэл",
      gatedTitle: "Үргэлжлүүлэн уншихын тулд үнэгүй бүртгүүлнэ үү",
      gatedBody:
        "Бүртгэлгүй уншигч нийтлэлийн эхний талыг үзнэ. Google эсвэл Facebook-ээр үнэгүй бүртгүүлээд бүтнээр нь уншаарай.",
    },
    quote: {
      title: "Автоматжуулах ажлаа бидэнд хэлээрэй",
      subtitle:
        "Богино хүсэлт илгээвэл бид танай багт тохирох agentic AI, ERP эсвэл академийн замыг зураглана.",
      name: "Нэр",
      company: "Байгууллага",
      email: "Имэйл",
      service: "Сонирхож буй үйлчилгээ",
      message: "AgenticForce юунд туслах вэ?",
      submit: "Хүсэлт илгээх",
    },
    newsletter: {
      title: "Долоо хоногийн agentic AI тойм",
      subtitle:
        "Шалгагдсан AI мэдээ болон AgenticForce дүн шинжилгээг сонгосон хэлээрээ аваарай.",
      email: "Имэйл хаяг",
      consent: "AgenticForce newsletter хүлээн авахыг зөвшөөрч байна.",
      submit: "Бүртгүүлэх",
    },
    admin: {
      title: "AgenticForce CRM",
      subtitle:
        "Бүртгэлтэй хэрэглэгч, newsletter, үнийн санал, нийтлэлийн draft, analytics.",
      locked: "Admin эрх шаардлагатай.",
    },
  },
} satisfies Record<Locale, Record<string, unknown>>;
