  "use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { products as initialProducts, Product, InstallmentPlan, initialInstallmentPlans } from "@/app/lib/dummy-data";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";

const Products = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];
  const brands = ["all", ...Array.from(new Set(products.map((p) => p.brand)))];

  const [availablePlans, setAvailablePlans] = useState<InstallmentPlan[]>([]);

  // Load available installment plans
  useEffect(() => {
    const storedPlans = localStorage.getItem("installmentPlans");
    if (storedPlans) {
      setAvailablePlans(JSON.parse(storedPlans));
    } else {
      setAvailablePlans(initialInstallmentPlans);
    }
  }, []);

  // Helper function to get plan names from plan IDs
  const getPlanNames = (planIds: string[] | undefined): string[] => {
    if (!planIds || planIds.length === 0) return [];
    return planIds
      .map((id) => availablePlans.find((plan) => plan.id === id)?.planName)
      .filter((name): name is string => name !== undefined);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesBrand = brandFilter === "all" || product.brand === brandFilter;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success("Product deleted successfully");
  };

  const handleEdit = (product: Product) => {
    router.push(`/admin/edit-product/${product.id}`);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button
          onClick={() => router.push("/admin/add-product")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand === "all" ? "All Brands" : brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[150px]">Installment Plan(s)</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                    <TableCell>
                      <Avatar className="h-10 w-10 rounded-md">
                        <AvatarImage 
                          src={product.image} 
                          alt={product.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-md text-xs">
                          {product.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {(() => {
                        // Support both new format (installmentPlanIds) and legacy format (installmentPlanId)
                        const planIds = product.installmentPlanIds || 
                                       (product.installmentPlanId ? [product.installmentPlanId] : []);
                        const planNames = getPlanNames(planIds);
                        
                        if (planNames.length === 0) {
                          return (
                            <span className="text-xs text-muted-foreground italic">None</span>
                          );
                        }
                        
                        return (
                          <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                            {planNames.map((planName) => (
                              <Badge
                                key={planName}
                                variant="secondary"
                                className="text-xs whitespace-nowrap"
                              >
                                {planName}
                              </Badge>
                            ))}
                          </div>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{product.dateCreated}</TableCell>
                    <TableCell className="hidden lg:table-cell">{product.time}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
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

export default Products;
