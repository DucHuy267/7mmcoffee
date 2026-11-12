export type Locale = "vi" | "en";

export type PublicCategory = {
  id: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  active: boolean;
};
export type PublicProduct = {
  id: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery: string[];
  featured: boolean;
  category: PublicCategory;
};
export type PublicStory = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  coverImage: string;
  category: string;
  author: string;
  publishedAt: string | null;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
};
export type PublicAbout = {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  storyTitle: string;
  storyContent: string;
  coffeeTitle: string;
  coffeeContent: string;
  philosophy: Array<{ title: string; description: string }>;
  gallery: string[];
  cta: { label: string; href: string };
};
export type PublicSettings = {
  siteName: string;
  logo: string;
  heroVideo: string;
  heroImage: string;
  heroSlogan: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  googleMapsUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
};

export type PublicStaff = {
  id: string;
  name: string;
  role: string;
};

export type WorkSegment = {
  startTime: string;
  endTime: string;
};

export type PublicWorkSchedule = {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  workDate: string;

  shiftType?: "full_time" | "part_time";
  segments?: WorkSegment[];

  shiftName: string;
  status: "assigned" | "swapped" | "off";
  note: string;
};

export type PublicDeepCleanTask = {
  id: string;
  taskName: string;
  detail: string;
  assignedToId: string;
  assignedToName: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed";
};
