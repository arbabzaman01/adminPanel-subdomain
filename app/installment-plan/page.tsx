"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InstallmentPlan, initialInstallmentPlans } from "@/app/lib/dummy-data";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";

const InstallmentPlans = () => {
  const router = useRouter();
  const [plans, setPlans] = useState<InstallmentPlan[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<InstallmentPlan | null>(null);

  // Load plans from localStorage or use initial data
  useEffect(() => {
    const storedPlans = localStorage.getItem("installmentPlans");
    if (storedPlans) {
      setPlans(JSON.parse(storedPlans));
    } else {
      setPlans(initialInstallmentPlans);
      localStorage.setItem("installmentPlans", JSON.stringify(initialInstallmentPlans));
    }
  }, []);

  // Save plans to localStorage whenever they change
  useEffect(() => {
    if (plans.length > 0) {
      localStorage.setItem("installmentPlans", JSON.stringify(plans));
    }
  }, [plans]);

  const handleEdit = (plan: InstallmentPlan) => {
    router.push(`/admin/installment/edit/${plan.id}`);
  };

  const handleDelete = (plan: InstallmentPlan) => {
    setPlanToDelete(plan);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (planToDelete) {
      setPlans(plans.filter((p) => p.id !== planToDelete.id));
      toast.success("Installment plan deleted successfully");
      setIsDeleteDialogOpen(false);
      setPlanToDelete(null);
    }
  };


  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Installment Plans</h2>
          <p className="text-muted-foreground">
            Manage installment plan settings for client-side calculations
          </p>
        </div>
        <Button onClick={() => router.push("/admin/installment/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Plan
        </Button>
      </div>

      {plans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No installment plans found</p>
            <Button onClick={() => router.push("/admin/installment/add")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl font-semibold">{plan.planName}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                      onClick={() => handleEdit(plan)}
                      title="Edit plan"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(plan)}
                      title="Delete plan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground">
                      Weekly %
                    </span>
                    <span className="text-lg font-bold">{plan.weeklyPercentage}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground">
                      Monthly %
                    </span>
                    <span className="text-lg font-bold">{plan.monthlyPercentage}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <span className="text-sm font-medium">Total Price %</span>
                    <span className="text-lg font-bold text-primary">
                      {plan.totalPricePercentage}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}


      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the installment plan "{planToDelete?.planName}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InstallmentPlans;

