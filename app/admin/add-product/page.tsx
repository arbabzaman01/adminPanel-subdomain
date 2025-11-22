"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { products as initialProducts, Product, InstallmentPlan, initialInstallmentPlans } from "@/app/lib/dummy-data";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { isValidImageFile } from "@/app/lib/image-utils";
import imageCompression from "browser-image-compression";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { PRODUCT_CATEGORIES } from "@/app/lib/dummy-data";

const AddProduct = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [availablePlans, setAvailablePlans] = useState<InstallmentPlan[]>([]);
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Constants for image compression
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
  const MAX_DIMENSION = 1200; // 1200px

  // Load products and plans from localStorage
  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem("products", JSON.stringify(initialProducts));
    }

    const storedPlans = localStorage.getItem("installmentPlans");
    if (storedPlans) {
      setAvailablePlans(JSON.parse(storedPlans));
    } else {
      setAvailablePlans(initialInstallmentPlans);
    }
  }, []);

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
        maxSizeMB: 2,
        maxWidthOrHeight: MAX_DIMENSION,
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!category) {
      newErrors.category = "Category is required";
    }

    const priceInput = document.getElementById("price") as HTMLInputElement;
    const price = priceInput ? Number(priceInput.value) : 0;
    if (!price || isNaN(price) || price <= 0) {
      newErrors.price = "Price must be a number greater than 0";
    }

    const stockInput = document.getElementById("stock") as HTMLInputElement;
    const stock = stockInput ? stockInput.value : "";
    if (stock && (isNaN(Number(stock)) || Number(stock) < 0)) {
      newErrors.stock = "Stock must be a non-negative number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const formData = new FormData(e.currentTarget);

    const newProduct: Product = {
      id: String(Date.now()),
      name: formData.get("name") as string,
      brand: formData.get("brand") as string,
      category: category,
      price: Number(formData.get("price")),
      stock: formData.get("stock") ? Number(formData.get("stock")) : undefined,
      description: formData.get("description") as string || undefined,
      installmentPlanIds: selectedPlanIds.length > 0 ? selectedPlanIds : undefined,
      dateCreated: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      image: imagePreview || undefined,
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    toast.success("Product added successfully");
    router.push("/products");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
          <p className="text-muted-foreground">
            Enter the product details below
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Fill in all the required information to add a new product to your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Image */}
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

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., iPhone 15 Pro Max"
                required
                className="w-full"
              />
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <Label htmlFor="brand">
                Brand <span className="text-destructive">*</span>
              </Label>
              <Input
                id="brand"
                name="brand"
                placeholder="e.g., Apple"
                required
                className="w-full"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category" className={`w-full ${errors.category ? "border-destructive" : ""}`}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-destructive">{errors.category}</p>
              )}
            </div>

            {/* Price and Stock in a row on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                  className={`w-full ${errors.price ? "border-destructive" : ""}`}
                />
                {errors.price && (
                  <p className="text-xs text-destructive">{errors.price}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  className={`w-full ${errors.stock ? "border-destructive" : ""}`}
                />
                {errors.stock && (
                  <p className="text-xs text-destructive">{errors.stock}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter product description..."
                rows={4}
                className="w-full resize-none"
              />
            </div>

            {/* Installment Plans */}
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

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;

