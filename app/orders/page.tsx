"use client";
import { useState } from "react";
import { orders as initialOrders, Order } from "@/app/lib/dummy-data";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, Clock, Package } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/ui/avatar";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning hover:bg-warning/20";
      case "processing":
        return "bg-primary/10 text-primary hover:bg-primary/20";
      case "completed":
        return "bg-success/10 text-success hover:bg-success/20";
      default:
        return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "processing":
        return <Package className="h-3 w-3" />;
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast.success(`Order ${newStatus === "processing" ? "proceeded" : "updated"}`);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">Manage customer orders and their status</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="hidden md:table-cell">Brand</TableHead>
                  <TableHead className="hidden lg:table-cell">Category</TableHead>
                  <TableHead className="hidden xl:table-cell">Installment</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Avatar className="h-10 w-10 rounded-md">
                        <AvatarImage 
                          src={order.productImage} 
                          alt={order.productName}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-md text-xs">
                          {order.productName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{order.username}</TableCell>
                    <TableCell>{order.productName}</TableCell>
                    <TableCell className="hidden md:table-cell">{order.brand}</TableCell>
                    <TableCell className="hidden lg:table-cell">{order.category}</TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {order.installmentPlan}
                    </TableCell>
                    <TableCell>${order.price}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm">
                        <div>{order.dateCreated}</div>
                        <div className="text-muted-foreground">{order.time}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(order.id, "processing")}
                        >
                          Proceed
                        </Button>
                      )}
                      {order.status === "processing" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(order.id, "completed")}
                        >
                          Complete
                        </Button>
                      )}
                      {order.status === "completed" && (
                        <Badge variant="outline" className="text-success">
                          Done
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
