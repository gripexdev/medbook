import type { Service, Testimonial } from "@/lib/types";

const services: Service[] = [
  {
    id: "initial-consultation",
    category: "Consultation",
    name: "Initial Consultation",
    description: "Meet with one of our specialists to discuss your health goals and create a personalized care plan tailored to your needs.",
    duration: "45 min",
    durationMinutes: 45,
    price: "$95",
    image: "/images/services/consultation.svg"
  },
  {
    id: "signature-care",
    category: "Care",
    name: "Signature Care Session",
    description: "Our most popular appointment for returning patients. Comprehensive evaluation, treatment, and ongoing wellness support.",
    duration: "60 min",
    durationMinutes: 60,
    price: "$140",
    image: "/images/services/signature-care.svg"
  },
  {
    id: "follow-up-review",
    category: "Consultation",
    name: "Follow-Up Review",
    description: "A focused check-in to review your progress, adjust your treatment plan, and ensure you're on track to meet your health goals.",
    duration: "30 min",
    durationMinutes: 30,
    price: "$75",
    image: "/images/services/follow-up.svg"
  },
  {
    id: "executive-priority",
    category: "Specialty",
    name: "Executive Health Check",
    description: "A comprehensive wellness assessment with priority scheduling designed for busy professionals who value their time.",
    duration: "75 min",
    durationMinutes: 75,
    price: "$180",
    image: "/images/services/executive.svg"
  }
];

const testimonials: Testimonial[] = [
  {
    name: "Olivia Carter",
    role: "Patient since 2023",
    quote: "Booking my appointments used to be a nightmare. Now I can schedule everything in under a minute from my phone. The reminders are a lifesaver.",
    avatar: "/images/avatars/olivia.svg"
  },
  {
    name: "Daniel Brooks",
    role: "Executive Health Member",
    quote: "The priority scheduling alone is worth it. I can see available slots in real time, book instantly, and never worry about phone tag again.",
    avatar: "/images/avatars/daniel.svg"
  },
  {
    name: "Maya Bennett",
    role: "Wellness Program Patient",
    quote: "I've been to a lot of clinics, and this is by far the most seamless experience. Professional, modern, and genuinely easy to use.",
    avatar: "/images/avatars/maya.svg"
  }
];

export const siteConfig = {
  name: "MEDBOOK",
  businessLabel: "Modern Healthcare Scheduling",
  tagline: "Healthcare scheduling, simplified.",
  description:
    "Book appointments with top-rated healthcare providers. Real-time availability, instant confirmation, and automated reminders.",
  heroDescription:
    "Skip the phone calls and waiting rooms. MEDBOOK lets you browse services, check real-time availability, and book confirmed appointments in seconds - all from your device.",
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
    { value: "2,400+", label: "Appointments booked" },
    { value: "4.9/5", label: "Patient satisfaction" },
    { value: "< 60s", label: "Average booking time" }
  ],
  trustBadges: [
    {
      title: "HIPAA Compliant",
      description: "Your health data is encrypted and handled according to federal privacy standards."
    },
    {
      title: "Instant Confirmation",
      description: "Receive booking confirmation via email the moment your appointment is scheduled."
    },
    {
      title: "24/7 Online Booking",
      description: "Schedule appointments any time, day or night. No phone calls required."
    },
    {
      title: "Automated Reminders",
      description: "Never miss an appointment with email reminders sent 24 hours before your visit."
    }
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
      title: "Choose your service",
      description: "Browse our care options and select the appointment type that fits your needs."
    },
    {
      title: "Pick a time that works",
      description: "View real-time availability and choose a date and time slot that suits your schedule."
    },
    {
      title: "You're all set",
      description: "Receive instant confirmation and manage your appointments from your personal dashboard."
    }
  ]
};
