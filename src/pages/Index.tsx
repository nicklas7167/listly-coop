import { Button } from "@/components/ui/button";
import { PlusCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { CreateListDialog } from "@/components/CreateListDialog";
import { JoinListDialog } from "@/components/JoinListDialog";

const Index = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/30">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-6">
          Grocery List
        </h1>
        <p className="text-lg md:text-xl text-gray-600 text-center max-w-2xl mb-12">
          Create and share grocery lists with your family and friends. Simple, fast, and collaborative.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
          <Button
            size="lg"
            className="flex items-center gap-2 w-full sm:w-auto"
            onClick={() => setShowCreateDialog(true)}
          >
            <PlusCircle className="w-5 h-5" />
            Create List
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex items-center gap-2 w-full sm:w-auto"
            onClick={() => setShowJoinDialog(true)}
          >
            <Share2 className="w-5 h-5" />
            Join List
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl bg-white shadow-lg animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <CreateListDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <JoinListDialog open={showJoinDialog} onOpenChange={setShowJoinDialog} />
    </div>
  );
};

const features = [
  {
    title: "Create Lists",
    description: "Create multiple grocery lists for different occasions or stores.",
    icon: PlusCircle,
  },
  {
    title: "Collaborate",
    description: "Share your lists with family and friends using a simple code.",
    icon: Share2,
  },
  {
    title: "Real-time Updates",
    description: "See changes instantly when items are added or checked off.",
    icon: Share2,
  },
];

export default Index;