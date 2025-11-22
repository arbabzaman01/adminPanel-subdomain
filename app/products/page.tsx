  "use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { products as initialProducts, Product, InstallmentPlan, initialInstallmentPlans } from "@/app/lib/dummy-data";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { isValidImageFile } from "@/app/lib/image-utils";
import imageCompression from "browser-image-compression";
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
import { Checkbox } from "@/app/components/ui/checkbox";
import { Badge } from "@/app/components/ui/badge";

const Products = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [availablePlans, setAvailablePlans] = useState<InstallmentPlan[]>([]);
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Constants for image compression
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
  const MAX_DIMENSION = 1200; // 1200px
  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];
  const brands = ["all", ...Array.from(new Set(products.map((p) => p.brand)))];

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
    setEditingProduct(product);
    setImagePreview(product.image || "");
    // Load selected plan IDs (support both old and new format)
    const planIds = product.installmentPlanIds || 
                   (product.installmentPlanId ? [product.installmentPlanId] : []);
    setSelectedPlanIds(planIds);
    setIsAddDialogOpen(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      toast.error("Please upload a valid image file (JPG, PNG, or WebP)");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    try {
      setIsCompressing(true);

      // If image is already small (< 2 MB), use it directly
      if (file.size <= MAX_FILE_SIZE) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
          setCompressedFile(file);
        };
        reader.readAsDataURL(file);
        toast.success("Image ready for upload");
        setIsCompressing(false);
        return;
      }

      // Compress the image
      const options = {
        maxSizeMB: 2, // Max file size in MB
        maxWidthOrHeight: MAX_DIMENSION, // Max dimension
        useWebWorker: true,
        fileType: file.type,
      };

      const compressedFile = await imageCompression(file, options);

      // Check if compressed file is still too large
      if (compressedFile.size > MAX_FILE_SIZE) {
        toast.error(
          `Image is too large even after compression (${(compressedFile.size / 1024 / 1024).toFixed(2)} MB). Please use a smaller image.`
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setImagePreview("");
        setCompressedFile(null);
        setIsCompressing(false);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setCompressedFile(compressedFile);
        const originalSize = (file.size / 1024 / 1024).toFixed(2);
        const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);
        toast.success(
          `Image compressed: ${originalSize} MB → ${compressedSize} MB`
        );
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      toast.error("Failed to process image. Please try again.");
      console.error(error);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setImagePreview("");
      setCompressedFile(null);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setCompressedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePlanToggle = (planId: string) => {
    setSelectedPlanIds((prev) =>
      prev.includes(planId)
        ? prev.filter((id) => id !== planId)
        : [...prev, planId]
    );
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newProduct: Product = {
      id: editingProduct?.id || String(Date.now()),
      name: formData.get("name") as string,
      brand: formData.get("brand") as string,
      category: formData.get("category") as string,
      installmentPlanIds: selectedPlanIds.length > 0 ? selectedPlanIds : undefined,
      // Legacy fields for backward compatibility
      installmentPlan: editingProduct?.installmentPlan || "",
      installmentPlanId: selectedPlanIds.length === 1 ? selectedPlanIds[0] : editingProduct?.installmentPlanId || "",
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
    setCompressedFile(null);
    setSelectedPlanIds([]);
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
        <Button
          onClick={() => router.push("/admin/add-product")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              setImagePreview("");
              setCompressedFile(null);
              setEditingProduct(null);
              setSelectedPlanIds([]);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the product details below
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="flex flex-col items-center gap-4 w-full">
                  {isCompressing ? (
                    <div className="flex flex-col items-center justify-center w-full max-w-xs aspect-square rounded-lg border-2 border-dashed border-primary/30 bg-muted/30 gap-3 p-6">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                      <p className="text-sm text-muted-foreground font-medium">Compressing image...</p>
                    </div>
                  ) : imagePreview ? (
                    <div className="relative w-full max-w-xs">
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden border-2 border-border shadow-sm">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      {compressedFile && (
                        <p className="mt-2 text-xs text-center text-muted-foreground">
                          Size: {(compressedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-md hover:scale-110 transition-transform"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative w-full max-w-xs aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30 overflow-hidden group hover:border-primary/40 hover:bg-muted/40 transition-colors cursor-pointer">
                      <div className="upload-frame absolute inset-0 flex flex-col justify-center items-center gap-3 p-4 sm:p-6">
                        <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400/70 group-hover:text-gray-400 transition-colors" />
                        <div className="text-center space-y-1">
                          <p className="text-sm sm:text-base text-gray-400/80 font-normal">
                            Upload Product Picture
                          </p>
                          <p className="text-xs text-gray-400/60">
                            Click to Upload
                          </p>
                          <p className="text-xs text-gray-400/60">
                            Drag & Drop Image Here
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="w-full">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      disabled={isCompressing}
                      className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      JPG, PNG or WebP. Max 2MB, max dimension 1200px. Auto-compressed if needed.
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
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={editingProduct?.price}
                  required
                />
              </div>
              <div className="space-y-3">
                <Label>Installment Plans</Label>
                <p className="text-xs text-muted-foreground">
                  Select which installment plans are available for this product
                </p>
                <div className="space-y-2 border rounded-lg p-4 bg-muted/30 max-h-60 overflow-y-auto">
                  {availablePlans.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No installment plans available. Create plans in the Installment Plans section.
                    </p>
                  ) : (
                    availablePlans.map((plan) => (
                      <div key={plan.id} className="flex items-start space-x-3 py-2 border-b last:border-b-0">
                        <Checkbox
                          id={`plan-${plan.id}`}
                          checked={selectedPlanIds.includes(plan.id)}
                          onCheckedChange={() => handlePlanToggle(plan.id)}
                          className="mt-1"
                        />
                        <Label
                          htmlFor={`plan-${plan.id}`}
                          className="text-sm font-normal cursor-pointer flex-1"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="font-medium">{plan.planName}</span>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                              <span>Weekly: {plan.weeklyPercentage}%</span>
                              <span>Monthly: {plan.monthlyPercentage}%</span>
                              <span>Total: {plan.totalPricePercentage}%</span>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))
                  )}
                </div>
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
