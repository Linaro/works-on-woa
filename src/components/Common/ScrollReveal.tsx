import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  staggerChildren?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  staggerChildren,
  ...props
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
        ...(staggerChildren
          ? { staggerChildren, delayChildren: delay }
          : {}),
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealChild({
  children,
  className,
  ...props
}: Omit<ScrollRevealProps, "delay" | "duration">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
