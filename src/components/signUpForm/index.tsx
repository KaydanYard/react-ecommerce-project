import { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useForm } from "react-hook-form";

export type SignUpFormValues = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

type SignUpProps = {
  onSuccess: (formValues: SignUpFormValues) => void;
  onError?: (errors: any) => void;
}

export function SignUpForm({ onSuccess, onError }: SignUpProps) {
  const { handleSubmit, register } = useForm<SignUpFormValues>({
    defaultValues: {}
  })

  return (
    <Form onSubmit={handleSubmit(onSuccess)}>
      <Form.Field>
        <label>Username</label>
        <input {...register('username')} name="username" placeholder="username" />
      </Form.Field>

      <Form.Field>
        <label>Email</label>
        <input {...register('email')} name="email" placeholder="email" />
      </Form.Field>

      <Form.Field>
        <label>Firstname</label>
        <input {...register('firstName')} name="firstName" placeholder="first name" />
      </Form.Field>

      <Form.Field>
        <label>Lastname</label>
        <input {...register('lastName')} name="lastName" placeholder="last name" />
      </Form.Field>

      <Form.Field>
        <label>Password</label>
        <input {...register('password')} type="password" name="password" placeholder="password" />
      </Form.Field>

      <Form.Field>
        <label>Confirm Password</label>
        <input {...register('confirmPassword')} type="password" name="confirmPassword" placeholder="confirm password" />
      </Form.Field>

      <Button type="submit">Sign Up</Button>
    </Form>
  );
}