"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { InstallmentPlan, initialInstallmentPlans, PLAN_NAME_OPTIONS } from "@/app/lib/dummy-data";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const EditInstallmentPlan = () => {
  const router = useRouter();
  const params = useParams();
  const planId = params.id as string;

  const [plans, setPlans] = useState<InstallmentPlan[]>([]);
  const [plan, setPlan] = useState<InstallmentPlan | null>(null);
  const [planName, setPlanName] = useState<string>("");
  const [weeklyPercentage, setWeeklyPercentage] = useState<string>("");
  const [monthlyPercentage, setMonthlyPercentage] = useState<string>("");
  const [totalPricePercentage, setTotalPricePercentage] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load plans from localStorage
  useEffect(() => {
    const storedPlans = localStorage.getItem("installmentPlans");
    const allPlans = storedPlans ? JSON.parse(storedPlans) : initialInstallmentPlans;
    setPlans(allPlans);

    const foundPlan = allPlans.find((p: InstallmentPlan) => p.id === planId);
    if (foundPlan) {
      setPlan(foundPlan);
      setPlanName(foundPlan.planName);
      setWeeklyPercentage(foundPlan.weeklyPercentage.toString());
      setMonthlyPercentage(foundPlan.monthlyPercentage.toString());
      setTotalPricePercentage(foundPlan.totalPricePercentage.toString());
    } else {
      toast.error("Installment plan not found");
      router.push("/installment-plan");
    }
  }, [planId, router]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!planName) {
      newErrors.planName = "Plan name is required";
    }

    const weekly = parseFloat(weeklyPercentage);
    if (!weeklyPercentage || isNaN(weekly) || weekly <= 0) {
      newErrors.weeklyPercentage = "Weekly percentage must be a number greater than 0";
    } else if (weekly > 100) {
      newErrors.weeklyPercentage = "Weekly percentage cannot exceed 100";
    }

    const monthly = parseFloat(monthlyPercentage);
    if (!monthlyPercentage || isNaN(monthly) || monthly <= 0) {
      newErrors.monthlyPercentage = "Monthly percentage must be a number greater than 0";
    } else if (monthly > 100) {
      newErrors.monthlyPercentage = "Monthly percentage cannot exceed 100";
    }

    const total = parseFloat(totalPricePercentage);
    if (!totalPricePercentage || isNaN(total) || total <= 0) {
      newErrors.totalPricePercentage = "Total price percentage must be a number greater than 0";
    } else if (total > 100) {
      newErrors.totalPricePercentage = "Total price percentage cannot exceed 100";
    }

    // Check if plan name already exists (excluding current plan)
    if (planName && plans.some((p) => p.planName === planName && p.id !== planId)) {
      newErrors.planName = "A plan with this name already exists";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm() || !plan) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const updatedPlan: InstallmentPlan = {
      ...plan,
      planName: planName,
      weeklyPercentage: parseFloat(weeklyPercentage),
      monthlyPercentage: parseFloat(monthlyPercentage),
      totalPricePercentage: parseFloat(totalPricePercentage),
    };

    const updatedPlans = plans.map((p) => (p.id === planId ? updatedPlan : p));
    setPlans(updatedPlans);
    localStorage.setItem("installmentPlans", JSON.stringify(updatedPlans));

    toast.success("Installment plan updated successfully");
    router.push("/installment-plan");
  };

  if (!plan) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-lg mb-4">Loading plan...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <h2 className="text-3xl font-bold tracking-tight">Edit Installment Plan</h2>
          <p className="text-muted-foreground">
            Update the installment plan details below
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan Details</CardTitle>
          <CardDescription>
            Modify the installment plan information. All fields are pre-filled with current values.
            These percentages will be used by the client side to calculate installment amounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="planName">
                Plan Name <span className="text-destructive">*</span>
              </Label>
              <Select value={planName} onValueChange={setPlanName} required>
                <SelectTrigger id="planName" className={errors.planName ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a plan type">
                    {planName || "Select a plan type"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PLAN_NAME_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.planName && (
                <p className="text-xs text-destructive">{errors.planName}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Current: <span className="font-medium">{plan.planName}</span> - Select the installment plan duration
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
                value={weeklyPercentage}
                onChange={(e) => setWeeklyPercentage(e.target.value)}
                className={errors.weeklyPercentage ? "border-destructive" : ""}
                required
              />
              {errors.weeklyPercentage && (
                <p className="text-xs text-destructive">{errors.weeklyPercentage}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Current: <span className="font-medium">{plan.weeklyPercentage}%</span> - The percentage applied per week (0-100)
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
                value={monthlyPercentage}
                onChange={(e) => setMonthlyPercentage(e.target.value)}
                className={errors.monthlyPercentage ? "border-destructive" : ""}
                required
              />
              {errors.monthlyPercentage && (
                <p className="text-xs text-destructive">{errors.monthlyPercentage}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Current: <span className="font-medium">{plan.monthlyPercentage}%</span> - The percentage applied per month (0-100)
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
                value={totalPricePercentage}
                onChange={(e) => setTotalPricePercentage(e.target.value)}
                className={errors.totalPricePercentage ? "border-destructive" : ""}
                required
              />
              {errors.totalPricePercentage && (
                <p className="text-xs text-destructive">{errors.totalPricePercentage}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Current: <span className="font-medium">{plan.totalPricePercentage}%</span> - The percentage of the total product price that will be used for calculations (0-100)
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
                Update Plan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditInstallmentPlan;

