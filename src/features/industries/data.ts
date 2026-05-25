import {
  Banknote,
  Building2,
  Factory,
  GraduationCap,
  HeartPulse,
  Hotel,
  Landmark,
  Scale,
  ShoppingBag,
  Truck,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";

export type IndustryData = {
  slug: string;
  icon: LucideIcon;
  en: IndustryCopy;
  mn: IndustryCopy;
};

export type IndustryCopy = {
  navLabel: string;
  menuDescription: string;
  breadcrumb: string;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  stats: Array<{ value: string; label: string }>;
  ecosystemLabel: string;
  ecosystemTitle: string;
  tabs: string[];
  agents: Array<{ title: string; body: string; metric: string }>;
  processLabel: string;
  processTitle: string;
  processSteps: Array<{ title: string; body: string }>;
  whyLabel: string;
  whyTitle: string;
  benefits: Array<{ title: string; body: string }>;
  casesLabel: string;
  casesTitle: string;
  useCases: Array<{ title: string; flow: string[]; outcome: string }>;
  integrationsLabel: string;
  integrationsTitle: string;
  integrations: string[];
  ctaLabel: string;
  ctaTitle: string;
  ctaBody: string;
};

const sharedEn = {
  primaryCta: "Request a demo",
  secondaryCta: "Explore agents",
  ecosystemLabel: "Industry AI ecosystem",
  processLabel: "How AI agents work",
  whyLabel: "Why Agentic AI",
  casesLabel: "Automation use cases",
  integrationsLabel: "Integrations",
  ctaLabel: "Next step",
};

const sharedMn = {
  primaryCta: "Демо захиалах",
  secondaryCta: "Агентуудыг үзэх",
  ecosystemLabel: "Салбарын AI экосистем",
  processLabel: "AI агентууд хэрхэн ажилладаг вэ",
  whyLabel: "Яагаад Agentic AI вэ",
  casesLabel: "Автоматжуулалтын жишээ",
  integrationsLabel: "Интеграци",
  ctaLabel: "Дараагийн алхам",
};

export const industries: IndustryData[] = [
  {
    slug: "healthcare",
    icon: HeartPulse,
    en: {
      ...sharedEn,
      navLabel: "Healthcare",
      menuDescription: "Patient communication, scheduling, care operations, and analytics.",
      breadcrumb: "Healthcare organizations",
      eyebrow: "Healthcare AI agents",
      title: "AI agents that streamline healthcare operations",
      accent: "without losing the human touch.",
      description:
        "Automate patient communication, appointment flows, reminders, document handling, and operational reporting while keeping clinical teams in control.",
      stats: [
        { value: "70-90%", label: "Admin time saved" },
        { value: "2-5x", label: "Faster follow-up" },
        { value: "30-50%", label: "No-show reduction" },
        { value: "24/7", label: "Patient response" },
      ],
      ecosystemTitle: "Specialized AI agents for clinics, hospitals, and health networks",
      tabs: ["Patient communication", "Clinical admin", "Marketing & outreach", "Finance & operations"],
      agents: [
        { title: "Appointment Manager Agent", body: "Books, confirms, reschedules, and updates patient visits.", metric: "7-10 hrs/week saved" },
        { title: "SMS Reminder Agent", body: "Sends visit, vaccine, lab, and follow-up reminders.", metric: "5-8 hrs/week saved" },
        { title: "Call Response Agent", body: "Answers routine phone requests and routes urgent issues.", metric: "24/7 support" },
        { title: "Medical Document Agent", body: "Organizes forms, reports, referrals, and patient documents.", metric: "8-12 hrs/week saved" },
        { title: "Care Follow-up Agent", body: "Checks recovery, medication adherence, and next-step needs.", metric: "Better continuity" },
        { title: "Analytics Agent", body: "Reports appointments, demand, cancellations, and service bottlenecks.", metric: "2-4 hrs/week saved" },
      ],
      processTitle: "Simple process, stronger care operations",
      processSteps: [
        { title: "Collect data", body: "Receives requests from web, phone, SMS, forms, and internal systems." },
        { title: "Understand and classify", body: "Identifies intent, urgency, department, and required next step." },
        { title: "Execute workflow", body: "Schedules, replies, updates records, and prepares tasks for staff." },
        { title: "Escalate to humans", body: "Routes sensitive, urgent, or uncertain cases to the right person." },
        { title: "Report and improve", body: "Summarizes results, waiting times, workload, and missed opportunities." },
      ],
      whyTitle: "Why healthcare organizations choose AI agents",
      benefits: [
        { title: "More patients reached", body: "Routine outreach continues even when staff are busy." },
        { title: "Less admin burden", body: "Front desk and care teams spend less time on repetitive coordination." },
        { title: "Better patient experience", body: "Patients get faster answers, reminders, and follow-up." },
        { title: "Operational visibility", body: "Managers see capacity, demand, and bottlenecks in one view." },
        { title: "Easy integration", body: "Agents connect to your current tools instead of replacing everything." },
      ],
      casesTitle: "Real healthcare automation examples",
      useCases: [
        { title: "Visit reminder SMS", flow: ["Appointment created", "SMS reminder", "Patient confirms"], outcome: "No-shows decrease" },
        { title: "Lab result follow-up", flow: ["Result ready", "Patient notified", "Next visit booked"], outcome: "Faster follow-up" },
        { title: "Phone request routing", flow: ["Call received", "Intent detected", "Staff task created"], outcome: "Lower call load" },
        { title: "Vaccine campaign", flow: ["Eligible patients", "Reminder sent", "Visit scheduled"], outcome: "Higher completion rate" },
      ],
      integrationsTitle: "Connects with the systems your team already uses",
      integrations: ["Clinic ERP", "eHealth", "DoctorPro", "HubSpot", "Mailchimp", "Twilio", "Facebook", "Instagram", "Other systems"],
      ctaTitle: "Build a healthcare AI workflow around your real process",
      ctaBody: "We map your patient journey, choose the right agents, and deploy with human approval points.",
    },
    mn: {
      ...sharedMn,
      navLabel: "Эрүүл мэнд",
      menuDescription: "Өвчтөнтэй харилцах, цаг товлох, үйлчилгээний урсгал, аналитик.",
      breadcrumb: "Эрүүл мэндийн байгууллагууд",
      eyebrow: "Эрүүл мэндийн AI агентууд",
      title: "Эрүүл мэндийн байгууллагын ажлыг хөнгөвчлөх",
      accent: "AI агентууд.",
      description:
        "Өвчтөнтэй харилцах, цаг товлох, сануулга илгээх, бичиг баримт цэгцлэх, тайлан гаргах ажлыг автоматжуулж, хүний хяналтыг хадгална.",
      stats: [
        { value: "70-90%", label: "Гар ажил багасна" },
        { value: "2-5x", label: "Хариу хурдсана" },
        { value: "30-50%", label: "Ирэхгүй тохиолдол буурна" },
        { value: "24/7", label: "Хариу өгнө" },
      ],
      ecosystemTitle: "Эмнэлэг, клиник, эрүүл мэндийн сүлжээнд зориулсан AI агентууд",
      tabs: ["Өвчтөнтэй харилцах", "Эмнэлгийн админ", "Маркетинг ба харилцаа", "Санхүү ба үйл ажиллагаа"],
      agents: [
        { title: "Цаг товлох агент", body: "Өвчтөний цаг авах, баталгаажуулах, өөрчлөх ажлыг автоматжуулна.", metric: "7-10 цаг/долоо хоног хэмнэнэ" },
        { title: "SMS сануулгын агент", body: "Үзлэг, вакцин, шинжилгээ, давтан ирэлтийн сануулга илгээнэ.", metric: "5-8 цаг/долоо хоног хэмнэнэ" },
        { title: "Дуудлагын хариу агент", body: "Энгийн асуултад хариулж, яаралтай хүсэлтийг зөв хүн рүү шилжүүлнэ.", metric: "24/7 ажиллана" },
        { title: "Эмнэлгийн бичиг баримтын агент", body: "Маягт, тайлан, лавлагаа, өвчтөний материалыг цэгцэлнэ.", metric: "8-12 цаг/долоо хоног хэмнэнэ" },
        { title: "Давтан хяналтын агент", body: "Эдгэрэлт, эм уух байдал, дараагийн алхмыг шалгана.", metric: "Илүү тогтвортой үйлчилгээ" },
        { title: "Өгөгдөл шинжилгээний агент", body: "Цаг авалт, ачаалал, цуцлалт, саатлыг тайлагнана.", metric: "2-4 цаг/долоо хоног хэмнэнэ" },
      ],
      processTitle: "Энгийн процесс, хүчирхэг үр дүн",
      processSteps: [
        { title: "Өгөгдөл цуглуулах", body: "Вэб, утас, SMS, маягт, дотоод системээс хүсэлт авна." },
        { title: "Ойлгож ангилах", body: "Хүсэлтийн зорилго, яаралтай эсэх, хэлтэс, дараагийн алхмыг тодорхойлно." },
        { title: "Үйлдэл хийх", body: "Цаг товлож, хариу илгээж, бүртгэл шинэчилж, ажил үүсгэнэ." },
        { title: "Хүнд шилжүүлэх", body: "Эмзэг, яаралтай, тодорхойгүй тохиолдлыг зөв ажилтанд дамжуулна." },
        { title: "Тайлагнаж сайжруулах", body: "Хүлээлт, ачаалал, үр дүн, алдагдсан боломжийг нэгтгэнэ." },
      ],
      whyTitle: "Эрүүл мэндийн байгууллагууд яагаад сонгодог вэ?",
      benefits: [
        { title: "Илүү олон өвчтөнд хүрнэ", body: "Ажилтнууд завгүй байсан ч сануулга, харилцаа тасрахгүй." },
        { title: "Админ ажил багасна", body: "Ресепшн болон эмнэлгийн баг давтагдах зохицуулалтад бага цаг зарцуулна." },
        { title: "Өвчтөний сэтгэл ханамж өснө", body: "Хариу, сануулга, давтан холбоо илүү хурдан болно." },
        { title: "Удирдлагын харагдац нэмэгдэнэ", body: "Ачаалал, эрэлт, саатлыг нэг самбараас харна." },
        { title: "Хялбар интеграци", body: "Одоо ашиглаж буй системүүдтэй холбогдож ажиллана." },
      ],
      casesTitle: "Бодит хэрэглээний жишээнүүд",
      useCases: [
        { title: "Үзлэгийн SMS сануулга", flow: ["Цаг бүртгэгдэнэ", "SMS илгээнэ", "Өвчтөн батална"], outcome: "Ирэхгүй тохиолдол буурна" },
        { title: "Шинжилгээний хариу мэдэгдэх", flow: ["Хариу бэлэн", "Өвчтөнд мэдэгдэнэ", "Дараагийн цаг авна"], outcome: "Давтан хяналт хурдсана" },
        { title: "Дуудлага чиглүүлэх", flow: ["Дуудлага ирнэ", "Зорилго танина", "Ажил үүсгэнэ"], outcome: "Дуудлагын ачаалал буурна" },
        { title: "Вакцины кампанит ажил", flow: ["Зорилтот өвчтөн", "Сануулга илгээнэ", "Цаг товлоно"], outcome: "Хамрагдалт нэмэгдэнэ" },
      ],
      integrationsTitle: "Таны ашигладаг системүүдтэй уялдана",
      integrations: ["Clinic ERP", "eHealth", "DoctorPro", "HubSpot", "Mailchimp", "Twilio", "Facebook", "Instagram", "Бусад"],
      ctaTitle: "Танай байгууллагад тохирсон эрүүл мэндийн AI урсгалыг хамтдаа бүтээе",
      ctaBody: "Бид өвчтөний замналыг зураглаж, тохирох агентуудыг сонгон, хүний баталгаажуулалттайгаар нэвтрүүлнэ.",
    },
  },
  {
    slug: "finance-banking",
    icon: Banknote,
    en: buildIndustryEn("Finance & Banking", "financial institutions", "risk, compliance, service, onboarding, and portfolio operations", "client onboarding, KYC document handling, support routing, collections reminders, and management reporting", ["KYC Agent", "Customer Support Agent", "Loan Follow-up Agent", "Compliance Monitor Agent", "Portfolio Insight Agent", "Document Review Agent"], ["Core banking", "CRM", "KYC tools", "Email", "SMS", "Call center", "Power BI", "Excel"]),
    mn: buildIndustryMn("Санхүү ба банк", "санхүүгийн байгууллагууд", "эрсдэл, нийцэл, үйлчилгээ, бүртгэл, багцын үйл ажиллагаа", "харилцагч бүртгэл, KYC бичиг баримт, лавлагаа чиглүүлэх, төлбөрийн сануулга, удирдлагын тайлан", ["KYC агент", "Харилцагчийн туслах агент", "Зээлийн дагалдах агент", "Нийцлийн хяналтын агент", "Багцын аналитик агент", "Баримт шалгах агент"], ["Core banking", "CRM", "KYC хэрэгсэл", "Имэйл", "SMS", "Дуудлагын төв", "Power BI", "Excel"]),
  },
  {
    slug: "retail-ecommerce",
    icon: ShoppingBag,
    en: buildIndustryEn("Retail & E-commerce", "retail and online commerce teams", "orders, inventory, customer care, promotions, and retention", "product inquiries, abandoned cart recovery, inventory alerts, campaign content, and loyalty follow-up", ["Shopping Assistant Agent", "Order Support Agent", "Inventory Alert Agent", "Promotion Agent", "Review Response Agent", "Loyalty Agent"], ["Shopify", "WooCommerce", "POS", "ERP", "CRM", "Meta", "Instagram", "Email"]),
    mn: buildIndustryMn("Жижиглэн худалдаа ба e-commerce", "дэлгүүр, онлайн худалдааны багууд", "захиалга, нөөц, хэрэглэгчийн үйлчилгээ, урамшуулал, дахин худалдан авалт", "барааны асуулт, сагс орхисон хэрэглэгч, нөөцийн анхааруулга, кампанит контент, loyalty дагалдах ажил", ["Худалдан авалтын туслах агент", "Захиалгын туслах агент", "Нөөцийн анхааруулах агент", "Урамшууллын агент", "Сэтгэгдэл хариулах агент", "Loyalty агент"], ["Shopify", "WooCommerce", "POS", "ERP", "CRM", "Meta", "Instagram", "Имэйл"]),
  },
  {
    slug: "education",
    icon: GraduationCap,
    en: buildIndustryEn("Education", "schools, universities, and training providers", "admissions, student support, learning operations, and alumni engagement", "student inquiries, enrollment workflows, course reminders, lesson content support, and attendance reporting", ["Admissions Agent", "Student Support Agent", "Course Reminder Agent", "Learning Content Agent", "Attendance Agent", "Alumni Outreach Agent"], ["LMS", "Google Workspace", "Moodle", "CRM", "Email", "SMS", "Calendar", "Sheets"]),
    mn: buildIndustryMn("Боловсрол", "сургууль, их дээд сургууль, сургалтын байгууллагууд", "элсэлт, суралцагчийн үйлчилгээ, сургалтын үйл ажиллагаа, төгсөгчдийн харилцаа", "суралцагчийн асуулт, элсэлтийн урсгал, хичээлийн сануулга, сургалтын контент, ирцийн тайлан", ["Элсэлтийн агент", "Суралцагчийн туслах агент", "Хичээлийн сануулгын агент", "Контент дэмжих агент", "Ирцийн агент", "Төгсөгчдийн харилцааны агент"], ["LMS", "Google Workspace", "Moodle", "CRM", "Имэйл", "SMS", "Календар", "Sheets"]),
  },
  {
    slug: "real-estate",
    icon: Building2,
    en: buildIndustryEn("Real Estate", "real estate developers, agencies, and property teams", "lead response, listing operations, viewings, tenant care, and reporting", "buyer qualification, property matching, showing schedules, lease reminders, and pipeline reporting", ["Property Match Agent", "Buyer Qualification Agent", "Viewing Scheduler Agent", "Tenant Support Agent", "Listing Content Agent", "Pipeline Report Agent"], ["CRM", "Property portals", "Website", "Facebook", "Instagram", "Email", "SMS", "Calendar"]),
    mn: buildIndustryMn("Үл хөдлөх хөрөнгө", "үл хөдлөх хөгжүүлэгч, агентлаг, property багууд", "лидийн хариу, зарын ажиллагаа, үзлэгийн цаг, түрээслэгчийн үйлчилгээ, тайлан", "худалдан авагч ангилах, үл хөдлөх тааруулах, үзлэг товлох, гэрээний сануулга, pipeline тайлан", ["Үл хөдлөх тааруулах агент", "Худалдан авагч ангилах агент", "Үзлэг товлох агент", "Түрээслэгчийн туслах агент", "Зарын контент агент", "Pipeline тайлангийн агент"], ["CRM", "Property портал", "Website", "Facebook", "Instagram", "Имэйл", "SMS", "Календар"]),
  },
  {
    slug: "manufacturing",
    icon: Factory,
    en: buildIndustryEn("Manufacturing", "manufacturers and production operations", "production coordination, maintenance, procurement, quality, and reporting", "work order tracking, supplier follow-up, maintenance alerts, quality issue summaries, and shift reports", ["Production Coordinator Agent", "Maintenance Alert Agent", "Supplier Follow-up Agent", "Quality Review Agent", "Inventory Planning Agent", "Shift Report Agent"], ["ERP", "MES", "Inventory", "Email", "SMS", "Power BI", "Excel", "Supplier portals"]),
    mn: buildIndustryMn("Үйлдвэрлэл", "үйлдвэр, үйлдвэрлэлийн үйл ажиллагаа", "үйлдвэрлэлийн зохицуулалт, засвар үйлчилгээ, худалдан авалт, чанар, тайлан", "ажлын захиалга, нийлүүлэгчийн дагалдах ажил, засварын анхааруулга, чанарын асуудлын нэгтгэл, ээлжийн тайлан", ["Үйлдвэрлэлийн зохицуулагч агент", "Засварын анхааруулах агент", "Нийлүүлэгч дагах агент", "Чанарын хяналтын агент", "Нөөц төлөвлөлтийн агент", "Ээлжийн тайлангийн агент"], ["ERP", "MES", "Нөөц", "Имэйл", "SMS", "Power BI", "Excel", "Нийлүүлэгчийн портал"]),
  },
  {
    slug: "logistics-transportation",
    icon: Truck,
    en: buildIndustryEn("Logistics & Transportation", "logistics, delivery, and transportation teams", "dispatching, tracking, customer updates, capacity planning, and exceptions", "shipment status updates, route exceptions, driver communication, invoice support, and service reporting", ["Dispatch Agent", "Shipment Tracking Agent", "Exception Alert Agent", "Driver Communication Agent", "Capacity Planning Agent", "Invoice Support Agent"], ["TMS", "Fleet tools", "GPS", "ERP", "Email", "SMS", "WhatsApp", "Customer portal"]),
    mn: buildIndustryMn("Логистик ба тээвэр", "логистик, хүргэлт, тээврийн багууд", "хуваарилалт, tracking, хэрэглэгчийн мэдээлэл, хүчин чадлын төлөвлөлт, саатал", "тээврийн төлөв мэдэгдэх, маршрутын саатал, жолоочтой харилцах, нэхэмжлэлийн тусламж, үйлчилгээний тайлан", ["Хуваарилалтын агент", "Ачаа tracking агент", "Саатлын анхааруулах агент", "Жолоочийн харилцааны агент", "Хүчин чадлын төлөвлөлтийн агент", "Нэхэмжлэлийн туслах агент"], ["TMS", "Fleet хэрэгсэл", "GPS", "ERP", "Имэйл", "SMS", "WhatsApp", "Хэрэглэгчийн портал"]),
  },
  {
    slug: "hospitality-tourism",
    icon: Hotel,
    en: buildIndustryEn("Hospitality & Tourism", "hotels, restaurants, travel agencies, and venues", "booking, guest communication, reviews, campaigns, and staff coordination", "reservation support, guest messages, upsell offers, review replies, and event coordination", ["Reservation Agent", "Guest Messaging Agent", "Review Response Agent", "Upsell Offer Agent", "Event Coordinator Agent", "Demand Forecast Agent"], ["PMS", "Booking.com", "Expedia", "Tripadvisor", "CRM", "Email", "SMS", "Instagram"]),
    mn: buildIndustryMn("Зочлох үйлчилгээ ба аялал жуулчлал", "зочид буудал, ресторан, аяллын агентлаг, арга хэмжээний газар", "захиалга, зочинтой харилцах, сэтгэгдэл, кампанит ажил, ажилтны зохицуулалт", "reservation тусламж, зочны мессеж, нэмэлт санал, сэтгэгдлийн хариу, event зохицуулалт", ["Захиалгын агент", "Зочинтой харилцах агент", "Сэтгэгдэл хариулах агент", "Нэмэлт саналын агент", "Арга хэмжээ зохицуулах агент", "Эрэлтийн таамаглах агент"], ["PMS", "Booking.com", "Expedia", "Tripadvisor", "CRM", "Имэйл", "SMS", "Instagram"]),
  },
  {
    slug: "legal-professional-services",
    icon: Scale,
    en: buildIndustryEn("Legal & Professional Services", "law firms, consultancies, accounting, and advisory teams", "intake, document workflow, client updates, research, and billing support", "client intake, matter routing, document summaries, deadline reminders, and proposal preparation", ["Client Intake Agent", "Document Summary Agent", "Deadline Reminder Agent", "Research Assistant Agent", "Proposal Agent", "Billing Support Agent"], ["Practice management", "Google Drive", "Microsoft 365", "CRM", "Email", "Calendar", "DMS", "Billing tools"]),
    mn: buildIndustryMn("Хууль ба мэргэжлийн үйлчилгээ", "хуулийн фирм, зөвлөх, нягтлан, advisory багууд", "хүсэлт хүлээн авах, баримтын урсгал, харилцагчийн мэдээлэл, судалгаа, төлбөрийн тусламж", "харилцагчийн intake, хэрэг чиглүүлэх, баримт нэгтгэх, хугацааны сануулга, санал боловсруулах", ["Харилцагчийн intake агент", "Баримт нэгтгэх агент", "Хугацааны сануулгын агент", "Судалгааны туслах агент", "Санал боловсруулах агент", "Төлбөрийн туслах агент"], ["Practice management", "Google Drive", "Microsoft 365", "CRM", "Имэйл", "Календар", "DMS", "Billing хэрэгсэл"]),
  },
  {
    slug: "government-public-sector",
    icon: Landmark,
    en: buildIndustryEn("Government & Public Sector", "public agencies, municipalities, and state-owned organizations", "citizen service, case routing, permits, reporting, and internal operations", "citizen requests, document intake, permit status updates, internal task routing, and public reporting", ["Citizen Service Agent", "Permit Status Agent", "Document Intake Agent", "Case Routing Agent", "Public Report Agent", "Internal Ops Agent"], ["Government ERP", "Citizen portal", "Email", "SMS", "Call center", "Power BI", "Document systems", "Maps"]),
    mn: buildIndustryMn("Төр ба нийтийн сектор", "төрийн байгууллага, хот/дүүрэг, төрийн өмчит байгууллагууд", "иргэдийн үйлчилгээ, кейс чиглүүлэх, зөвшөөрөл, тайлан, дотоод ажиллагаа", "иргэний хүсэлт, баримт хүлээн авах, зөвшөөрлийн төлөв мэдэгдэх, дотоод ажил чиглүүлэх, олон нийтийн тайлан", ["Иргэдийн үйлчилгээний агент", "Зөвшөөрлийн төлөв агент", "Баримт хүлээн авах агент", "Кейс чиглүүлэх агент", "Олон нийтийн тайлангийн агент", "Дотоод ажиллагааны агент"], ["Government ERP", "Иргэний портал", "Имэйл", "SMS", "Дуудлагын төв", "Power BI", "Баримтын систем", "Газрын зураг"]),
  },
];

function buildIndustryEn(
  navLabel: string,
  audience: string,
  operations: string,
  automations: string,
  agentNames: string[],
  integrations: string[]
): IndustryCopy {
  return {
    ...sharedEn,
    navLabel,
    menuDescription: `AI agents for ${operations}.`,
    breadcrumb: navLabel,
    eyebrow: `${navLabel} AI agents`,
    title: `AI agents for ${audience}`,
    accent: "that keep work moving.",
    description: `Automate ${automations} with a controlled agentic workflow designed for ${audience}.`,
    stats: [
      { value: "60-85%", label: "Manual work saved" },
      { value: "2-4x", label: "Faster response" },
      { value: "24/7", label: "Service coverage" },
      { value: "1 view", label: "Operations dashboard" },
    ],
    ecosystemTitle: `Specialized agents for ${operations}`,
    tabs: ["Customer service", "Operations", "Marketing", "Analytics"],
    agents: agentNames.map((name, index) => ({
      title: name,
      body: [
        "Handles repeated requests and routes important cases to the right person.",
        "Updates records, creates tasks, and keeps teams aligned without manual handoffs.",
        "Turns daily activity into a clear operating rhythm for managers.",
      ][index % 3],
      metric: ["5-8 hrs/week saved", "24/7 coverage", "Faster cycle time"][index % 3],
    })),
    processTitle: "A controlled workflow for daily operations",
    processSteps: [
      { title: "Capture request", body: "Collects inputs from forms, email, chat, phone notes, and internal systems." },
      { title: "Classify intent", body: "Understands the request type, urgency, customer segment, and owner." },
      { title: "Take action", body: "Replies, updates records, prepares documents, or creates the next task." },
      { title: "Escalate exceptions", body: "Sends sensitive, high-value, or uncertain cases to human operators." },
      { title: "Report outcomes", body: "Shows workload, response time, conversion, and bottlenecks." },
    ],
    whyTitle: `Why ${audience} choose Agentic AI`,
    benefits: [
      { title: "More capacity", body: "Teams handle more work without adding repetitive headcount." },
      { title: "Faster service", body: "Customers and internal teams get answers sooner." },
      { title: "Cleaner data", body: "Records, tasks, and statuses stay current automatically." },
      { title: "Human control", body: "Important decisions remain with your team." },
      { title: "Measurable results", body: "Every workflow can be tracked through reports and KPIs." },
    ],
    casesTitle: "Practical automation examples",
    useCases: [
      { title: "Inbound request handling", flow: ["Request arrives", "Intent detected", "Task routed"], outcome: "Response time improves" },
      { title: "Document workflow", flow: ["File received", "Summary created", "Owner notified"], outcome: "Admin work decreases" },
      { title: "Customer follow-up", flow: ["Trigger event", "Message sent", "Reply captured"], outcome: "More follow-up completed" },
      { title: "Management reporting", flow: ["Data collected", "KPI summarized", "Actions recommended"], outcome: "Decisions get faster" },
    ],
    integrationsTitle: "Connects to your existing stack",
    integrations,
    ctaTitle: `Design your ${navLabel.toLowerCase()} AI agent system`,
    ctaBody: "We map the workflow, prioritize the highest-value agents, and deploy with approvals and measurable KPIs.",
  };
}

function buildIndustryMn(
  navLabel: string,
  audience: string,
  operations: string,
  automations: string,
  agentNames: string[],
  integrations: string[]
): IndustryCopy {
  return {
    ...sharedMn,
    navLabel,
    menuDescription: `${operations}-д зориулсан AI агентууд.`,
    breadcrumb: navLabel,
    eyebrow: `${navLabel} AI агентууд`,
    title: `${audience}-д зориулсан AI агентууд`,
    accent: "ажлыг тасралтгүй явуулна.",
    description: `${automations}-ыг хүний хяналттай agentic workflow-оор автоматжуулна.`,
    stats: [
      { value: "60-85%", label: "Гар ажил хэмнэнэ" },
      { value: "2-4x", label: "Хариу хурдсана" },
      { value: "24/7", label: "Үйлчилгээ тасрахгүй" },
      { value: "1 самбар", label: "Удирдлагын харагдац" },
    ],
    ecosystemTitle: `${operations}-д зориулсан мэргэшсэн агентууд`,
    tabs: ["Харилцагчийн үйлчилгээ", "Үйл ажиллагаа", "Маркетинг", "Аналитик"],
    agents: agentNames.map((name, index) => ({
      title: name,
      body: [
        "Давтагддаг хүсэлтийг шийдэж, чухал кейсийг зөв хүн рүү чиглүүлнэ.",
        "Бүртгэл шинэчилж, ажил үүсгэж, багийн уялдааг хадгална.",
        "Өдөр тутмын ажлыг удирдлагад ойлгомжтой хэмнэл болгон нэгтгэнэ.",
      ][index % 3],
      metric: ["5-8 цаг/долоо хоног хэмнэнэ", "24/7 ажиллана", "Цикл хурдсана"][index % 3],
    })),
    processTitle: "Өдөр тутмын ажиллагаанд зориулсан хяналттай урсгал",
    processSteps: [
      { title: "Хүсэлт авах", body: "Маягт, имэйл, чат, утасны тэмдэглэл, дотоод системээс оролт авна." },
      { title: "Зорилго ангилах", body: "Хүсэлтийн төрөл, яаралтай эсэх, сегмент, эзэмшигчийг тодорхойлно." },
      { title: "Үйлдэл хийх", body: "Хариу илгээж, бүртгэл шинэчилж, баримт бэлдэж, дараагийн ажлыг үүсгэнэ." },
      { title: "Онцгой кейс шилжүүлэх", body: "Эмзэг, өндөр үнэ цэнтэй, тодорхойгүй тохиолдлыг хүнд дамжуулна." },
      { title: "Үр дүн тайлагнах", body: "Ачаалал, хариу өгөх хугацаа, conversion, bottleneck-ийг харуулна." },
    ],
    whyTitle: `${audience} яагаад Agentic AI сонгодог вэ`,
    benefits: [
      { title: "Илүү их хүчин чадал", body: "Баг давтагддаг ажил нэмэхгүйгээр илүү их ажлыг гүйцэтгэнэ." },
      { title: "Илүү хурдан үйлчилгээ", body: "Харилцагч болон дотоод баг хурдан хариу авна." },
      { title: "Цэвэр өгөгдөл", body: "Бүртгэл, ажил, төлөв автоматаар шинэчлэгдэнэ." },
      { title: "Хүний хяналт", body: "Чухал шийдвэрийг танай баг гаргасан хэвээр байна." },
      { title: "Хэмжигдэх үр дүн", body: "Workflow бүр KPI, тайлангаар хэмжигдэнэ." },
    ],
    casesTitle: "Бодит автоматжуулалтын жишээ",
    useCases: [
      { title: "Ирсэн хүсэлт шийдэх", flow: ["Хүсэлт ирнэ", "Зорилго танина", "Ажил чиглүүлнэ"], outcome: "Хариу хурдсана" },
      { title: "Баримтын урсгал", flow: ["Файл ирнэ", "Товч нэгтгэнэ", "Эзэнд мэдэгдэнэ"], outcome: "Админ ажил багасна" },
      { title: "Харилцагч дагах", flow: ["Trigger үүснэ", "Мессеж илгээнэ", "Хариу бүртгэнэ"], outcome: "Follow-up нэмэгдэнэ" },
      { title: "Удирдлагын тайлан", flow: ["Дата цугларна", "KPI нэгтгэнэ", "Action санал болгоно"], outcome: "Шийдвэр хурдсана" },
    ],
    integrationsTitle: "Одоо ашиглаж буй системүүдтэй холбогдоно",
    integrations,
    ctaTitle: `${navLabel}-ын AI агент системээ төлөвлөе`,
    ctaBody: "Бид workflow зураглаж, хамгийн өндөр үнэ цэнтэй агентуудыг эрэмбэлж, баталгаажуулалт болон KPI-тай нэвтрүүлнэ.",
  };
}

export function getIndustryBySlug(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}

export function getLocalizedIndustry(slug: string, locale: Locale = "en") {
  const industry = getIndustryBySlug(slug);
  if (!industry) return undefined;

  return {
    slug: industry.slug,
    icon: industry.icon,
    ...industry[locale],
  };
}

export function industryPath(slug: string, locale: Locale = "en", includeLocale = true) {
  return `${includeLocale ? `/${locale}` : ""}/industries/${slug}`;
}

export function getIndustriesNavItems(locale: Locale = "en", includeLocale = false) {
  return industries.map((industry) => {
    const copy = industry[locale];
    return {
      label: copy.navLabel,
      description: copy.menuDescription,
      href: industryPath(industry.slug, locale, includeLocale),
    };
  });
}
