// Dummy data for the admin panel

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  installmentPlan: string;
  price: number;
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

export const products: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "Smartphones",
    installmentPlan: "12 months",
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
    installmentPlan: "18 months",
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
    installmentPlan: "24 months",
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
    installmentPlan: "12 months",
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
    installmentPlan: "6 months",
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
    installmentPlan: "12 months",
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
    installmentPlan: "12 months",
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
    installmentPlan: "24 months",
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
