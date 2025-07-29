import { useForm } from "react-hook-form";
import { type SignUpFormData, signUpSchema } from "../../schemas/auth.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form.tsx";
import { Input } from "../ui/input.tsx";
import { Button } from "../ui/button.tsx";
import { supabase } from "../../libs/supabase.ts";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../libs/constants.ts";

const SignUpForm = () => {
  const navigate = useNavigate()
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
  });

  // User Sign Up
  const onSubmit = async (values: SignUpFormData)=> {
    try{
    //   Sign up with supabase auth
      const {data:authData,error:authError} = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            fullName: values.fullName
          }
        }
      })
      if (authError) throw authError;

      if(authData.user){
      //   update user profile in public.users table
        const {error:profileError} = await supabase.from('users').update({full_name:values.fullName}).eq("auth_id",authData.user.id)
        if (profileError) throw profileError;
        toast.success("Account created successfully! Please check your email for confirmation.")
        navigate(ROUTES.SIGN_IN);
      }
    }catch(error){
      toast.error(error instanceof Error ? error.message: 'An error occurred');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-4`}>
        <FormField
          name={`fullName`}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input type={`text`} placeholder={`John Doe`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={`email`}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input type={`email`} placeholder={`johndoe@example.com`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={`password`}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type={`password`} placeholder={`John Doe`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type={`submit`} className={`w-full`}>Sign Up</Button>
      </form>
    </Form>
  );
};
export default SignUpForm;
