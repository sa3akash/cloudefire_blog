"use client";

import { Input } from "@/components/ui/input";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";

interface AuthFormFieldsProps {
  isLogin: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
}

export function AuthFormFields({
  isLogin,
  showPassword,
  onTogglePassword,
}: AuthFormFieldsProps) {
  return (
    <>
      {!isLogin && (
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="authName">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="authName"
              name="name"
              type="text"
              placeholder="Ada Lovelace"
              required={!isLogin}
              className="pl-10 h-10 text-xs rounded-xl"
              autoFocus={!isLogin}
            />
          </div>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="authEmail">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="authEmail"
            name="email"
            type="email"
            placeholder="you@domain.com"
            required
            className="pl-10 h-10 text-xs rounded-xl"
            autoFocus={isLogin}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="authPassword">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="authPassword"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••••"
            required
            minLength={6}
            className="pl-10 pr-10 h-10 text-xs rounded-xl"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </>
  );
}
