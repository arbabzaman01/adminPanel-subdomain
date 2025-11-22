// Dummy data for the admin panel

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  installmentPlan?: string; // Legacy field, kept for backward compatibility
  installmentPlanId?: string; // Legacy field, kept for backward compatibility
  installmentPlanIds?: string[]; // Array of assigned installment plan IDs
  price: number;
  stock?: number;
  description?: string;
  dateCreated: string;
  time: string;
  image?: string;
}

export interface Order {
  id: string;
  username: string;
  productName: string;
  brand: string;
  category: string;
  installmentPlan: string;
  price: number;
  status: "pending" | "processing" | "completed";
  dateCreated: string;
  time: string;
  productImage?: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  activeOrders: number;
}

export interface InstallmentPlan {
  id: string;
  planName: string;
  weeklyPercentage: number;
  monthlyPercentage: number;
  totalPricePercentage: number;
  dateCreated: string;
  time: string;
}

export const initialInstallmentPlans: InstallmentPlan[] = [
  {
    id: "1",
    planName: "Monthly",
    weeklyPercentage: 25.0,
    monthlyPercentage: 100.0,
    totalPricePercentage: 100,
    dateCreated: "2024-01-15",
    time: "09:30 AM",
  },
  {
    id: "2",
    planName: "3-Month",
    weeklyPercentage: 8.33,
    monthlyPercentage: 33.33,
    totalPricePercentage: 100,
    dateCreated: "2024-01-16",
    time: "10:15 AM",
  },
  {
    id: "3",
    planName: "6-Month",
    weeklyPercentage: 4.17,
    monthlyPercentage: 16.67,
    totalPricePercentage: 100,
    dateCreated: "2024-01-17",
    time: "11:45 AM",
  },
  {
    id: "4",
    planName: "9-Month",
    weeklyPercentage: 2.78,
    monthlyPercentage: 11.11,
    totalPricePercentage: 100,
    dateCreated: "2024-01-18",
    time: "02:20 PM",
  },
];

export const PLAN_NAME_OPTIONS = ["Monthly", "3-Month", "6-Month", "9-Month"] as const;

export const PRODUCT_CATEGORIES = [
  "Smartphones",
  "Laptops",
  "Tablets",
  "Headphones",
  "Gaming",
  "Electronics",
  "Accessories",
  "Other",
] as const;

export const products: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "Smartphones",
    installmentPlanIds: ["2", "3"], // 3-Month and 6-Month plans
    price: 1199,
    dateCreated: "2024-01-15",
    time: "09:30 AM",
    image: "https://images.unsplash.com/photo-1696446702094-dab25b89b74f?w=400&h=400&fit=crop",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Smartphones",
    installmentPlanIds: ["1", "2", "3"], // Monthly, 3-Month, and 6-Month plans
    price: 1099,
    dateCreated: "2024-01-16",
    time: "10:15 AM",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
  },
  {
    id: "3",
    name: "MacBook Pro 16",
    brand: "Apple",
    category: "Laptops",
    installmentPlanIds: ["1"], // Monthly plan only
    price: 2499,
    dateCreated: "2024-01-17",
    time: "11:45 AM",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
  },
  {
    id: "4",
    name: "Dell XPS 15",
    brand: "Dell",
    category: "Laptops",
    installmentPlanIds: ["2", "4"], // 3-Month and 9-Month plans
    price: 1799,
    dateCreated: "2024-01-18",
    time: "02:20 PM",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop",
  },
  {
    id: "5",
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Headphones",
    // No installment plans assigned
    price: 399,
    dateCreated: "2024-01-19",
    time: "03:30 PM",
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=400&fit=crop",
  },
  {
    id: "6",
    name: "iPad Pro 12.9",
    brand: "Apple",
    category: "Tablets",
    installmentPlanIds: ["3", "4"], // 6-Month and 9-Month plans
    price: 1099,
    dateCreated: "2024-01-20",
    time: "04:15 PM",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
  },
  {
    id: "7",
    name: "PlayStation 5",
    brand: "Sony",
    category: "Gaming",
    installmentPlanIds: ["2"], // 3-Month plan only
    price: 499,
    dateCreated: "2024-01-21",
    time: "09:00 AM",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop",
  },
  {
    id: "8",
    name: "LG OLED TV 65",
    brand: "LG",
    category: "Electronics",
    // No installment plans assigned
    price: 1999,
    dateCreated: "2024-01-22",
    time: "10:30 AM",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
  },
];

export const orders: Order[] = [
  {
    id: "1",
    username: "john_doe",
    productName: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "Smartphones",
    installmentPlan: "12 months",
    price: 1199,
    status: "pending",
    dateCreated: "2024-01-23",
    time: "09:15 AM",
    productImage: "https://images.unsplash.com/photo-1696446702094-dab25b89b74f?w=400&h=400&fit=crop",
  },
  {
    id: "2",
    username: "sarah_smith",
    productName: "MacBook Pro 16",
    brand: "Apple",
    category: "Laptops",
    installmentPlan: "24 months",
    price: 2499,
    status: "processing",
    dateCreated: "2024-01-23",
    time: "10:30 AM",
    productImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
  },
  {
    id: "3",
    username: "mike_johnson",
    productName: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Smartphones",
    installmentPlan: "18 months",
    price: 1099,
    status: "completed",
    dateCreated: "2024-01-22",
    time: "02:45 PM",
    productImage: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
  },
  {
    id: "4",
    username: "emily_brown",
    productName: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Headphones",
    installmentPlan: "6 months",
    price: 399,
    status: "pending",
    dateCreated: "2024-01-23",
    time: "11:20 AM",
    productImage: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=400&fit=crop",
  },
  {
    id: "5",
    username: "david_wilson",
    productName: "PlayStation 5",
    brand: "Sony",
    category: "Gaming",
    installmentPlan: "12 months",
    price: 499,
    status: "processing",
    dateCreated: "2024-01-23",
    time: "01:00 PM",
    productImage: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop",
  },
  {
    id: "6",
    username: "lisa_anderson",
    productName: "Dell XPS 15",
    brand: "Dell",
    category: "Laptops",
    installmentPlan: "12 months",
    price: 1799,
    status: "completed",
    dateCreated: "2024-01-21",
    time: "03:30 PM",
    productImage: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop",
  },
];

export const dashboardStats: DashboardStats = {
  totalOrders: orders.length,
  totalProducts: products.length,
  totalRevenue: orders.reduce((sum, order) => sum + order.price, 0),
  activeOrders: orders.filter((order) => order.status !== "completed").length,
};

export const adminProfile = {
  name: "Admin User",
  email: "admin@example.com",
  role: "Administrator",
  avatar: "https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff",
};
