  "use client";
import { useState, useRef } from "react";
import { products as initialProducts, Product } from "@/app/lib/dummy-data";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { compressImage, isValidImageFile } from "@/app/lib/image-utils";
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
import { Plus, Search, Pencil, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";

const Products = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];
  const brands = ["all", ...Array.from(new Set(products.map((p) => p.brand)))];

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
    setEditingProduct(product);
    setImagePreview(product.image || "");
    setIsAddDialogOpen(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      toast.error("Please upload a valid image file (JPG, PNG, or WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setIsCompressing(true);
      const compressed = await compressImage(file, 800, 800, 0.8);
      setImagePreview(compressed);
      toast.success("Image compressed successfully");
    } catch (error) {
      toast.error("Failed to compress image");
      console.error(error);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProduct: Product = {
      id: editingProduct?.id || String(Date.now()),
      name: formData.get("name") as string,
      brand: formData.get("brand") as string,
      category: formData.get("category") as string,
      installmentPlan: formData.get("installmentPlan") as string,
      price: Number(formData.get("price")),
      dateCreated: editingProduct?.dateCreated || new Date().toISOString().split("T")[0],
      time: editingProduct?.time || new Date().toLocaleTimeString(),
      image: imagePreview || undefined,
    };

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? newProduct : p)));
      toast.success("Product updated successfully");
    } else {
      setProducts([...products, newProduct]);
      toast.success("Product added successfully");
    }

    setIsAddDialogOpen(false);
    setEditingProduct(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setImagePreview("");
            setEditingProduct(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingProduct(null);
              setImagePreview("");
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Update" : "Enter"} the product details below
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="flex flex-col items-center gap-4">
                  {imagePreview ? (
                    <div className="relative">
                      <Avatar className="h-32 w-32 rounded-lg">
                        <AvatarImage src={imagePreview} alt="Product preview" className="object-cover" />
                        <AvatarFallback className="rounded-lg">Preview</AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-7 w-7 rounded-full"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="w-full">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      disabled={isCompressing}
                      className="cursor-pointer"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      JPG, PNG or WebP (max 5MB). Will be auto-compressed.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingProduct?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  defaultValue={editingProduct?.brand}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  defaultValue={editingProduct?.category}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="installmentPlan">Installment Plan</Label>
                <Input
                  id="installmentPlan"
                  name="installmentPlan"
                  defaultValue={editingProduct?.installmentPlan}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={editingProduct?.price}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingProduct ? "Update" : "Add"} Product
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
                  <TableHead>Installment</TableHead>
                  <TableHead>Price</TableHead>
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
                    <TableCell>{product.installmentPlan}</TableCell>
                    <TableCell>${product.price}</TableCell>
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
