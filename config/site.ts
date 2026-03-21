import type { Service, Testimonial } from "@/lib/types";

const services: Service[] = [
  {
    id: "initial-consultation",
    category: "Consultation",
    name: "Initial Consultation",
    description: "A focused first appointment to understand goals, priorities, and the right next step.",
    duration: "45 min",
    durationMinutes: 45,
    price: "$95",
    image: "/images/services/consultation.svg"
  },
  {
    id: "signature-care",
    category: "Care",
    name: "Signature Care Session",
    description: "A premium appointment experience for returning clients who want steady, high-touch support.",
    duration: "60 min",
    durationMinutes: 60,
    price: "$140",
    image: "/images/services/signature-care.svg"
  },
  {
    id: "follow-up-review",
    category: "Consultation",
    name: "Follow-Up Review",
    description: "A shorter check-in to review progress, adjust the plan, and confirm your next milestone.",
    duration: "30 min",
    durationMinutes: 30,
    price: "$75",
    image: "/images/services/follow-up.svg"
  },
  {
    id: "executive-priority",
    category: "Specialty",
    name: "Executive Priority Visit",
    description: "A concierge-style session with extra planning time and priority scheduling for busy clients.",
    duration: "75 min",
    durationMinutes: 75,
    price: "$180",
    image: "/images/services/executive.svg"
  }
];

const testimonials: Testimonial[] = [
  {
    name: "Olivia Carter",
    role: "Returning Client",
    quote: "The experience feels calm, premium, and incredibly easy. Booking takes less than a minute.",
    avatar: "/images/avatars/olivia.svg"
  },
  {
    name: "Daniel Brooks",
    role: "Founder",
    quote: "MEDBOOK looks like a real client project, not a demo. The flow is polished and the details feel intentional.",
    avatar: "/images/avatars/daniel.svg"
  },
  {
    name: "Maya Bennett",
    role: "Wellness Studio Owner",
    quote: "This is exactly the kind of clean interface clients trust. It feels modern without trying too hard.",
    avatar: "/images/avatars/maya.svg"
  }
];

export const siteConfig = {
  name: "MEDBOOK",
  businessLabel: "Booking Platform for Modern Care",
  tagline: "Appointment booking with product-grade clarity.",
  description:
    "A polished SaaS-style booking website concept for clinics, wellness teams, and premium service businesses.",
  heroDescription:
    "MEDBOOK gives clinics, consultants, and care teams a faster, cleaner way to present availability, highlight services, and turn visits into a high-trust digital experience.",
  heroImage: "/images/hero-booking.svg",
  contact: {
    email: "hello@medbook.co",
    phone: "(212) 555-0199",
    address: "214 Mercer Street, New York, NY"
  },
  hours: [
    "Mon - Thu: 9:00 AM - 6:00 PM",
    "Friday: 9:00 AM - 4:00 PM",
    "Saturday: By appointment"
  ],
  navigation: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/#services" },
    { label: "Contact", href: "/#contact" }
  ],
  socialLinks: [
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Dribbble", href: "#" }
  ],
  heroStats: [
    { value: "90 sec", label: "Average booking time" },
    { value: "4.9/5", label: "Client satisfaction" },
    { value: "24/7", label: "Always-on scheduling" }
  ],
  services,
  testimonials,
  slotIntervalMinutes: 15,
  bookingWindowDays: 21,
  reminderLeadHours: 24,
  defaultAvailability: [
    { weekday: 1, startTime: "09:00", endTime: "17:00" },
    { weekday: 2, startTime: "09:00", endTime: "17:00" },
    { weekday: 3, startTime: "09:00", endTime: "17:00" },
    { weekday: 4, startTime: "09:00", endTime: "17:00" },
    { weekday: 5, startTime: "09:00", endTime: "16:00" },
    { weekday: 6, startTime: "10:00", endTime: "14:00" }
  ],
  steps: [
    {
      title: "Choose service",
      description: "Select the session that fits your needs, timeline, and budget."
    },
    {
      title: "Pick date and time",
      description: "Choose a preferred appointment slot with a clean, guided form."
    },
    {
      title: "Confirm booking",
      description: "Submit once and review your confirmed appointment from the dashboard."
    }
  ]
};
