

import * as React from "react";
import type { ReactNode, HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/* =====================================================
   CARD CONTEXT
===================================================== */

type CardContextType = {
  variant: "default" | "accent";
};

const CardContext = React.createContext<CardContextType>({
  variant: "default",
});

const useCardContext = () => {
  return React.useContext(CardContext);
};

/* =====================================================
   CARD VARIANTS
===================================================== */

const cardVariants = cva(
  `
    flex w-full min-w-0 flex-col items-stretch
    rounded-[11px] text-card-foreground
    transition-colors duration-200
  `,
  {
    variants: {
      variant: {
        default: `
          border border-[#E7ECE9]
          bg-white
          dark:border-[#35463B]
          dark:bg-[#1C2921]
        `,
        accent: `
          border border-transparent
          bg-[#F2F5F0]
          p-1
          dark:bg-[#26372C]
        `,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/* =====================================================
   CARD PADDING
===================================================== */

const paddings = {
  none: "p-0",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-5",
  lg: "p-4 sm:p-6 lg:p-7",
};

/* =====================================================
   CARD HEADER VARIANTS
===================================================== */

const cardHeaderVariants = cva(
  `
    flex flex-wrap items-center justify-between
    gap-2.5 px-5 min-h-14
  `,
  {
    variants: {
      variant: {
        default: `
          border-b border-[#E7ECE9]
          dark:border-[#35463B]
        `,
        accent: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/* =====================================================
   CARD CONTENT VARIANTS
===================================================== */

const cardContentVariants = cva(
  "grow p-5",
  {
    variants: {
      variant: {
        default: "",
        accent: `
          rounded-t-xl bg-white
          [&:last-child]:rounded-b-xl
          dark:bg-[#1C2921]
        `,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/* =====================================================
   CARD TABLE VARIANTS
===================================================== */

const cardTableVariants = cva(
  "grid grow",
  {
    variants: {
      variant: {
        default: "",
        accent: `
          rounded-xl bg-white
          dark:bg-[#1C2921]
        `,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/* =====================================================
   CARD FOOTER VARIANTS
===================================================== */

const cardFooterVariants = cva(
  `
    flex items-center px-5 min-h-14
  `,
  {
    variants: {
      variant: {
        default: `
          border-t border-[#E7ECE9]
          dark:border-[#35463B]
        `,
        accent: `
          mt-[2px] rounded-b-xl bg-white
          dark:bg-[#1C2921]
        `,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/* =====================================================
   CARD PROPS
===================================================== */

export interface CardProps
  extends Omit<HTMLAttributes<HTMLElement>, "title">,
    VariantProps<typeof cardVariants> {
  children: ReactNode;
  title?: string;
  description?: string;
  headerAction?: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: boolean;
}

/* =====================================================
   MAIN CARD
===================================================== */

function Card({
  children,
  title,
  description,
  headerAction,
  padding = "md",
  shadow = true,
  variant = "default",
  className,
  ...props
}: CardProps) {
  const cardVariant = variant || "default";

  return (
    <CardContext.Provider value={{ variant: cardVariant }}>
      <section
        data-slot="card"
        className={cn(
          cardVariants({ variant: cardVariant }),
          shadow &&
            "shadow-[0_2px_8px_rgba(31,55,43,0.10)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.15)]",
          className,
        )}
        {...props}
      >
        {(title || description || headerAction) && (
          <div
            data-slot="card-header"
            className="
              flex flex-wrap items-start justify-between gap-2
              px-4 pt-4 sm:px-5 sm:pt-5
            "
          >
            <div className="min-w-0 flex-1">
              {title && (
                <h2
                  className="
                    text-[13px] font-semibold
                    text-[#26352D]
                    dark:text-[#E5EDE7]
                    sm:text-sm
                  "
                >
                  {title}
                </h2>
              )}

              {description && (
                <p
                  className="
                    mt-1 text-[10px] leading-4
                    text-[#929B96]
                    dark:text-[#A8B8AC]
                    sm:text-[11px]
                  "
                >
                  {description}
                </p>
              )}
            </div>

            {headerAction && (
              <div className="flex shrink-0 items-center gap-2">
                {headerAction}
              </div>
            )}
          </div>
        )}

        <div className={paddings[padding]}>
          {children}
        </div>
      </section>
    </CardContext.Provider>
  );
}

/* =====================================================
   CARD HEADER
===================================================== */

function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();

  return (
    <div
      data-slot="card-header"
      className={cn(
        cardHeaderVariants({ variant }),
        className,
      )}
      {...props}
    />
  );
}

/* =====================================================
   CARD CONTENT
===================================================== */

function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();

  return (
    <div
      data-slot="card-content"
      className={cn(
        cardContentVariants({ variant }),
        className,
      )}
      {...props}
    />
  );
}

/* =====================================================
   CARD TABLE
===================================================== */

function CardTable({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();

  return (
    <div
      data-slot="card-table"
      className={cn(
        cardTableVariants({ variant }),
        className,
      )}
      {...props}
    />
  );
}

/* =====================================================
   CARD FOOTER
===================================================== */

function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();

  return (
    <div
      data-slot="card-footer"
      className={cn(
        cardFooterVariants({ variant }),
        className,
      )}
      {...props}
    />
  );
}

/* =====================================================
   CARD HEADING
===================================================== */

function CardHeading({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-heading"
      className={cn("space-y-1", className)}
      {...props}
    />
  );
}

/* =====================================================
   CARD TOOLBAR
===================================================== */

function CardToolbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-toolbar"
      className={cn(
        "flex items-center gap-2.5",
        className,
      )}
      {...props}
    />
  );
}

/* =====================================================
   CARD TITLE
===================================================== */

function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        `
          text-base font-semibold leading-none
          tracking-tight text-[#26352D]
          dark:text-[#E5EDE7]
        `,
        className,
      )}
      {...props}
    />
  );
}

/* =====================================================
   CARD DESCRIPTION
===================================================== */

function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        `
          text-sm text-[#89948C]
          dark:text-[#A8B8AC]
        `,
        className,
      )}
      {...props}
    />
  );
}

/* =====================================================
   EXPORTS
===================================================== */

export {
  Card,
  CardHeader,
  CardContent,
  CardTable,
  CardFooter,
  CardHeading,
  CardToolbar,
  CardTitle,
  CardDescription,
  cardVariants,
  cardHeaderVariants,
  cardContentVariants,
  cardTableVariants,
  cardFooterVariants,
};
export default Card;
