"use client";
import { useState } from "react";
import NextLink from "next/link";
import {
  Button as HeroButton,
  Card,
  FieldError,
  Form,
  Input,
  InputGroup,
  Label,
  Separator,
  TextField,
  linkVariants,
} from "@heroui/react";

import { Button } from "@/components/ui/Button";

const linkClass = linkVariants().base();

export function AuthCard({
  title,
  description,
  submitLabel,
  isLoading = false,
  onSubmit,
  onGoogle,
  footerText,
  footerLinkLabel,
  footerHref,
  children,
}: {
  title: string;
  description: string;
  submitLabel: string;
  isLoading?: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogle: () => void;
  footerText: string;
  footerLinkLabel: string;
  footerHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-70px-32px)] px-4 py-8">
      <Card className="w-full max-w-sm p-6 md:p-7 rounded-3xl shadow-xl">
        <Card.Header className="items-center text-center gap-1">
          <Card.Title className="text-2xl font-nunito font-bold text-gray-900">{title}</Card.Title>
          <Card.Description className="text-sm text-gray-500">{description}</Card.Description>
        </Card.Header>

        <Card.Content>
          <Form onSubmit={onSubmit} className="flex flex-col gap-4">
            {children}
            <Button size="md" className="w-full mt-1" loading={isLoading}>
              {submitLabel}
            </Button>
          </Form>

          <div className="flex items-center gap-3 my-5">
            <Separator className="flex-1" />
            <span className="text-xs text-gray-400 whitespace-nowrap">or continue with</span>
            <Separator className="flex-1" />
          </div>

          <Button type="button" varient="outline" onClick={onGoogle} className="w-full">
            <GoogleIcon />
            Continue with Google
          </Button>
        </Card.Content>

        <Card.Footer className="justify-center text-sm text-gray-500 gap-1">
          {footerText}
          <NextLink href={footerHref} className={linkClass}>
            {footerLinkLabel}
          </NextLink>
        </Card.Footer>
      </Card>
    </div>
  );
}

export function AuthTextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email";
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <TextField isRequired type={type} value={value} onChange={onChange} autoComplete={autoComplete} className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <Input placeholder={placeholder} />
      <FieldError />
    </TextField>
  );
}

export function AuthPasswordField({
  value,
  onChange,
  autoComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
}) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      isRequired
      type={visible ? "text" : "password"}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className="flex flex-col gap-1.5"
    >
      <Label>Password</Label>
      <InputGroup>
        <InputGroup.Input placeholder="••••••" />
        <InputGroup.Suffix>
          <HeroButton
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label={visible ? "Hide password" : "Show password"}
            onPress={() => setVisible((v) => !v)}
          >
            <span className="material-symbols-outlined">{visible ? "visibility" : "visibility_off"}</span>
          </HeroButton>
        </InputGroup.Suffix>
      </InputGroup>
      <FieldError />
    </TextField>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
