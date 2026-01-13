"use client";
import React, { useState } from "react";
import { InfoIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type FormData = {
  name: string;
  email: string;
  phone: string;
};

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const newContactMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/new-contact`, data);
      return response.data;
    },
    onSuccess: () => {
      setServerError(null);
      router.push("/contacts");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = error.response?.data?.message ?? "Invalid credentials";
      setServerError(errorMessage);
    },
  });

  const onSubmit = async (data: FormData) => {
    newContactMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm space-y-6">
        <h1 className="text-xl font-semibold text-center"> Edit Contact </h1>

        {/* Nama */}
        <InputGroup>
          <InputGroupInput {...register("name", { required: "Name is required" })} id="name" name="name" placeholder="Ilham Suryana" />
          <InputGroupAddon>
            <Label htmlFor="name">Name</Label>
          </InputGroupAddon>
        </InputGroup>

        {/* Email */}
        <InputGroup>
          <InputGroupInput
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
            id="email"
            name="email"
            placeholder="ilham@email.com"
          />
          <InputGroupAddon>
            <Label htmlFor="email">Email</Label>
          </InputGroupAddon>
        </InputGroup>
        {/* Nomor HP */}
        {/* Phone */}
        <InputGroup>
          <InputGroupInput
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10,15}$/, // contoh validasi nomor HP 10-15 digit
                message: "Please enter a valid phone number",
              },
            })}
            id="phone"
            name="phone"
            placeholder="08xxxxxxxxxx"
          />
          <InputGroupAddon align="block-start">
            <Label htmlFor="phone" className="text-foreground">
              Phone
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton variant="ghost" aria-label="Help" className="ml-auto rounded-full" size="icon-xs">
                  <InfoIcon className="h-4 w-4" />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nomor ini dipakai untuk OTP & verifikasi</p>
              </TooltipContent>
            </Tooltip>
          </InputGroupAddon>
          {/* Tampilkan error jika ada */}
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </InputGroup>
        {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

        <Button type="submit" className="w-full" disabled={newContactMutation.isPending}>
          {newContactMutation.isPending ? "Sending..." : "Save"}
        </Button>
      </form>
    </div>
  );
};

export default Page;
