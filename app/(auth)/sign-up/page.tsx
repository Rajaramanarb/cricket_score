"use client";
import AuthForm from "@/components/forms/AuthForm";
import { signUpWithCredentials } from "@/lib/actions/auth.action";
import { SignInSchema, SignUpSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import React from "react";

const SignUp = () => {
  const defaultData = {
    email: "",
    password: "",
    name: "",
    username: "",
  };
  if (process.env.ENABLE_SIGNUP === "true") {
    return redirect("/sign-in");
  }
  return (
    <AuthForm
      formType="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={defaultData}
      onSubmit={signUpWithCredentials}
    />
  );
};

export default SignUp;
