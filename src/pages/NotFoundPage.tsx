import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Container } from "@/components/Common/Container";
import { Button } from "@/components/Common/Button";
import { GradientText } from "@/components/Common/GradientText";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  usePageTitle("Page Not Found");

  return (
    <main id="main-content" className="flex min-h-[70vh] items-center justify-center">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <GradientText as="h1" className="text-7xl font-bold md:text-9xl">
            404
          </GradientText>
          <p className="mt-4 text-xl text-[var(--color-text-secondary)]">
            Page not found
          </p>
          <p className="mt-2 text-[var(--color-text-tertiary)]">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button
            variant="primary"
            className="mt-8"
            onClick={() => navigate("/")}
          >
            {t("common.backToHome")}
          </Button>
        </motion.div>
      </Container>
    </main>
  );
}
