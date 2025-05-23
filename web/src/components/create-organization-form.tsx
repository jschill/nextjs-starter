'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createOrganizationSchema, type CreateOrganizationSchema } from '@/schemas'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createOrganization } from '@/app/create-organization/actions'
import { createCheckoutSession } from '@/app/(protected)/subscription/actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { getCountryDataList } from 'countries-list'
import { TierSelect } from './blocks/tier-select'

export function CreateOrganizationForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const form = useForm<CreateOrganizationSchema>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: '',
      vatnr: '',
      country: '',
      plan: 'pro',
    }
  })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = form

  const onSubmit = async (data: CreateOrganizationSchema) => {
    try {
      const { id } = await createOrganization(data)
      
      toast.success(`Organization created, redirecting to checkout...`)

      const stripeCheckoutSession = await createCheckoutSession({
        lookup_key: 'base',
        organizationId: id
      })

      window.location.href = stripeCheckoutSession.url
      // router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create organization')
      console.error('Error creating organization:', error)
      throw error
    }
  }
  const countryDataList = getCountryDataList()

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Create organization</CardTitle>
              <CardDescription>
                Enter your organization details below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Acme Inc."
                      required
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="vatnr">VAT number</Label>
                    </div>
                    <Input
                      id="vatnr"
                      type="text"
                      required {...register("vatnr")}
                    />
                    {errors.vatnr && (
                      <p className="text-red-500">{errors.vatnr.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(countryDataList).map(([, country]) => (
                                <SelectItem key={country.iso2} value={country.iso2}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {errors.country && (
                      <p className="text-red-500">{errors.country.message}</p>
                    )}
                  </div>

                  {/* Pricing Tier Selection */}
                  <div className="grid gap-2">
                    <TierSelect form={form} />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create"}
                  </Button>
                </div>
              </div>
              
            </CardContent>
          </Card>
        </form>
      </Form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking create, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
} 