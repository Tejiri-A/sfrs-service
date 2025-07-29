// src/components/auth/SignInForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInFormData } from "../../schemas/auth.ts";
import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form.tsx";
import { supabase } from "../../libs/supabase.ts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ROUTES } from "../../libs/constants.ts";
import { useAuth } from "../../hooks/useAuth.ts";

export function SignInForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormData) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      if (data.user) {
        // Get the user's role from public.users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("auth_id", data.user.id)
          .single();

        if (userError) throw userError;

        setUser({ ...data.user, role: userData?.role || "client" });

        // Redirect based on role
        switch (userData?.role) {
          case "client":
            navigate(ROUTES.CLIENT_DASHBOARD);
            break;
          case "validator":
            navigate(ROUTES.VALIDATOR_DASHBOARD);
            break;
          case "approver":
            navigate(ROUTES.APPROVER_DASHBOARD);
            break;
          default:
            navigate(ROUTES.CLIENT_DASHBOARD);
        }

        toast.success("Signed in successfully!");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid credentials");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </Form>
  );
}