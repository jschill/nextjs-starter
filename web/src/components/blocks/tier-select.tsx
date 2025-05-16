import { cn } from "@/lib/utils"
import { FormControl, FormLabel, FormMessage, FormField, FormItem } from "@/components/ui/form"
import { CheckIcon } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { CreateOrganizationSchema } from "@/schemas/create-organization"

export const TierSelect = ({ form }: { form: UseFormReturn<CreateOrganizationSchema> }) => {
  return (
    <FormField
      control={form.control}
      name="plan"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select a plan</FormLabel>
          <FormControl>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Basic Plan */}
              <div
                onClick={() => field.onChange('basic')}
                className={cn(
                  "relative cursor-pointer rounded-lg border p-4 shadow-sm transition-all hover:border-primary",
                  field.value === 'basic' ? "border-2 border-primary bg-primary/5" : "border-muted"
                )}
              >
                {field.value === 'basic' && (
                  <div className="absolute right-2 top-2 h-5 w-5 flex items-center justify-center rounded-full bg-primary">
                    <CheckIcon className="h-3 w-3 text-white" />
                  </div>
                )}
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium">Basic</h3>
                  <div className="text-sm text-muted-foreground">Free</div>
                </div>
                <p className="text-sm text-muted-foreground">For small teams getting started</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    5 team members
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    Basic features
                  </li>
                </ul>
              </div>

              {/* Pro Plan */}
              <div
                onClick={() => field.onChange('pro')}
                className={cn(
                  "relative cursor-pointer rounded-lg border p-4 shadow-sm transition-all hover:border-primary",
                  field.value === 'pro' ? "border-2 border-primary bg-primary/5" : "border-muted"
                )}
              >
                {field.value === 'pro' && (
                  <div className="absolute right-2 top-2 h-5 w-5 flex items-center justify-center rounded-full bg-primary">
                    <CheckIcon className="h-3 w-3 text-white" />
                  </div>
                )}
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium">Pro</h3>
                  <div className="text-sm text-muted-foreground">$49/month</div>
                </div>
                <p className="text-sm text-muted-foreground">For growing teams and businesses</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    Unlimited team members
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    Advanced features
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    Priority support
                  </li>
                </ul>
              </div>

              {/* Enterprise Plan */}
              <div
                onClick={() => field.onChange('enterprise')}
                className={cn(
                  "relative cursor-pointer rounded-lg border p-4 shadow-sm transition-all hover:border-primary",
                  field.value === 'enterprise' ? "border-2 border-primary bg-primary/5" : "border-muted"
                )}
              >
                {field.value === 'enterprise' && (
                  <div className="absolute right-2 top-2 h-5 w-5 flex items-center justify-center rounded-full bg-primary">
                    <CheckIcon className="h-3 w-3 text-white" />
                  </div>
                )}
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium">Enterprise</h3>
                  <div className="text-sm text-muted-foreground">$199/month</div>
                </div>
                <p className="text-sm text-muted-foreground">For large organizations with specific needs</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    Unlimited everything
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    Custom integrations
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    24/7 premium support
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    Advanced security
                  </li>
                </ul>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default TierSelect