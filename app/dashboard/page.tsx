"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { dashboardStats } from "@/app/lib/dummy-data";
import { Boxes, ShoppingCart, DollarSign, Package } from "lucide-react";
import { consumeQueuedAdminToast } from "@/utils/login-toast";

const Dashboard = () => {
  useEffect(() => {
    const snapshot = consumeQueuedAdminToast();

    if (snapshot) {
      toast.dismiss();
      toast.success(snapshot.message, {
        duration: snapshot.duration,
        position: "top-right",
        className: "login-toast",
        icon: null,
      });
    }
  }, []);


  const stats = [
    {
      title: "Total Products",
      value: dashboardStats.totalProducts,
      icon: Boxes,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Total Revenue",
      value: `$${dashboardStats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      title: "Active Orders",
      value: dashboardStats.activeOrders,
      icon: Package,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      title: "Total Orders",
      value: dashboardStats.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-indigo-600 dark:text-indigo-300",
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome to Your Admin Dashboard</h2>
        <p className="text-muted-foreground">Easily manage products, orders, installment plans, settings, and your profile from one central hub.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.bg} p-2 sm:p-2.5 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.title === "Total Orders" ? stat.color : "text-primary"}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">New order received</p>
                  <p className="text-sm text-muted-foreground">iPhone 15 Pro Max</p>
                </div>
                <span className="text-sm text-muted-foreground">2 min ago</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">Product updated</p>
                  <p className="text-sm text-muted-foreground">MacBook Pro 16</p>
                </div>
                <span className="text-sm text-muted-foreground">15 min ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order completed</p>
                  <p className="text-sm text-muted-foreground">Samsung Galaxy S24</p>
                </div>
                <span className="text-sm text-muted-foreground">1 hour ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending Orders</span>
                <span className="font-bold text-warning">
                  {dashboardStats.activeOrders}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Processing</span>
                <span className="font-bold text-primary">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed Today</span>
                <span className="font-bold text-success">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Low Stock Items</span>
                <span className="font-bold text-destructive">0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
