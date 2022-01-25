import { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useForm } from "react-hook-form";

export type LoginFormValues = {
  username?: string;
  password?: string;
}

type LoginProps = {
  onSuccess: (formValues: LoginFormValues) => void;
  onError?: (errors: any) => void;
}

export function Login({ onSuccess, onError }: LoginProps) {
  const { handleSubmit, register } = useForm<LoginFormValues>({
    mode: 'onSubmit',
    defaultValues: {}
  })
  return (
    <Form onSubmit={handleSubmit(onSuccess)}>
      <Form.Field>
        <label>Username</label>
        <input {...register('username')} placeholder="username" />
      </Form.Field>

      <Form.Field>
        <label>Password</label>
        <input {...register('password')} type="password" placeholder="password" />
      </Form.Field>

      <Button type="submit">Log In</Button>
    </Form>
  )
}