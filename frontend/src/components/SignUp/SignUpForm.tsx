import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Button
} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Input
} from "@/components/ui/input"
import {
  PasswordInput
} from "@/components/ui/password-input"
import { Link } from "react-router"
import { useState } from "react"

const formSchema = z.object({
  Name: z.string().min(3,"Name must be at least 3 characters long"),
  Email: z.string().email("Invalid email address"),
  Password: z.string().min(5,"Password must be at least 5 characters long")
});

export default function SignUpForm() {
  const [error, setError] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const bodyData = {
      name: values.Name,
      email: values.Email,
      password: values.Password
    }
    try {
      const url = import.meta.env.VITE_API_URL;

      const response = await fetch(`${url}auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData)
      })
      const data = await response.json()
      if (response.ok) window.location.href = "/"
      else setError(data.message)
    } catch (error) {
      console.error("Form submission error", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10 bg-[#21212e] p-3 rounded-md w-[500px]">

        <FormField
          control={form.control}
          name="Name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="name"
                  className="bg-[#282a36]"
                  type="text"
                  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  className="bg-[#282a36]"
                  type="email"
                  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Password" className="bg-[#282a36]" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="submit">Submit</Button>
          <Link to="/Login" className="underline">Already Have Account</Link>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </Form>
  )
}