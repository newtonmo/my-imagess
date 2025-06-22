
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SkillMediaGallery from "../components/SkillMediaGallery";
import { useSkillsData } from "@/hooks/useSkillsData";

const SkillDetail = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const { skills, loading } = useSkillsData();

  const skill = skillId ? skills.find(s => s.id === skillId) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading skill details...</p>
        </div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Skill not found</h1>
          <Link to="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 md:pt-20">
        <div className="bg-secondary/50 py-16 md:py-24">
          <div className="container-custom">
            <Link
              to="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="heading-xl mb-6">{skill.title}</h1>
            <p className="text-muted-foreground max-w-3xl text-lg">
              {skill.description}
            </p>
          </div>
        </div>

        <div className="container-custom py-16 md:py-24">
          <SkillMediaGallery skillId={skill.id} works={skill.works} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SkillDetail;
