"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InstallmentPlan, initialInstallmentPlans } from "@/app/lib/dummy-data";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const NewInstallmentPlan = () => {
  const router = useRouter();
  const [plans, setPlans] = useState<InstallmentPlan[]>([]);

  // Load plans from localStorage
  useEffect(() => {
    const storedPlans = localStorage.getItem("installmentPlans");
    if (storedPlans) {
      setPlans(JSON.parse(storedPlans));
    } else {
      setPlans(initialInstallmentPlans);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newPlan: InstallmentPlan = {
      id: String(Date.now()),
      planName: formData.get("planName") as string,
      weeklyPercentage: Number(formData.get("weeklyPercentage")),
      monthlyPercentage: Number(formData.get("monthlyPercentage")),
      totalPricePercentage: Number(formData.get("totalPricePercentage")),
      dateCreated: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedPlans = [...plans, newPlan];
    setPlans(updatedPlans);
    localStorage.setItem("installmentPlans", JSON.stringify(updatedPlans));

    toast.success("Installment plan created successfully");
    router.push("/installment-plan");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
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
          <h2 className="text-3xl font-bold tracking-tight">Add New Installment Plan</h2>
          <p className="text-muted-foreground">
            Create a new installment plan with percentage settings
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan Details</CardTitle>
          <CardDescription>
            Enter the installment plan information. These percentages will be used by the client
            side to calculate installment amounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="planName">
                Plan Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="planName"
                name="planName"
                placeholder="e.g., 3 Months, 6 Months, 9 Months"
                required
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                A descriptive name for this installment plan
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weeklyPercentage">
                Weekly Percentage <span className="text-destructive">*</span>
              </Label>
              <Input
                id="weeklyPercentage"
                name="weeklyPercentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="e.g., 8.33"
                required
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                The percentage applied per week (0-100)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyPercentage">
                Monthly Percentage <span className="text-destructive">*</span>
              </Label>
              <Input
                id="monthlyPercentage"
                name="monthlyPercentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="e.g., 33.33"
                required
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                The percentage applied per month (0-100)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalPricePercentage">
                Total Price Percentage <span className="text-destructive">*</span>
              </Label>
              <Input
                id="totalPricePercentage"
                name="totalPricePercentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="e.g., 100"
                required
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                The percentage of the total product price that will be used for calculations
                (0-100)
              </p>
            </div>

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
                Create Plan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewInstallmentPlan;

