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
  Email: z.string().email("Invalid email address"),
  Password: z.string().min(5, "Password must be atleast 5 letters")
});

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const bodyData = {
      email: values.Email,
      password: values.Password
    }
    const url = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${url}auth/login`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData),
        credentials: "include"
      })
      const data = await response.json()
      if (response.ok) {
        window.location.href = "/"
      }else{
        setError(data.message)
      }
      
    } catch (error) {
      console.error("Form submission error", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10 bg-[#21212e] p-3 rounded-md w-[500px]">

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
          <Link to="/signup" className="underline">Create Account</Link>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </Form>
  )
}