import NextLink, { LinkProps } from 'next/link';
import { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const linkVariants = cva(
  'hover:underline underline-offset-2 transition-colors',
  {
    variants: {
      variant: {
        default: '',
        primary: 'text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface UiLinkProps extends LinkProps, HTMLAttributes<HTMLAnchorElement>, VariantProps<typeof linkVariants> {}

export const Link = ({ className, variant, children, ...props }: UiLinkProps) => {
  return (
    <NextLink
      {...props}
      className={cn(linkVariants({ variant }), className)}
    >
      {children}
    </NextLink>
  );
};