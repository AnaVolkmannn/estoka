//Explicar o produto
//Botão Entrar / Criar conta
import { HeroSection } from "../../components/home/HeroSection";
import { FeaturesSection } from "../../components/home/FeaturesSection";
import { HowItWorksSection } from "../../components/home/HowItWorksSection";
import { CallToAction } from "../../components/home/CallToAction";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CallToAction />
    </>
  );
}
