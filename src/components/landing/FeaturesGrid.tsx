import { PlusCircle, Share2, Globe2 } from "lucide-react";

const features = [
  {
    title: "Smart Shopping Lists",
    description: "Create multiple lists for different stores or occasions. Keep track of what you need and who added each item.",
    icon: PlusCircle,
  },
  {
    title: "Real-time Collaboration",
    description: "Share lists with family members or roommates. Everyone sees updates instantly when items are added or checked off.",
    icon: Share2,
  },
  {
    title: "Multi-language Support",
    description: "Use the app in your preferred language - English, Spanish, or Danish. Switch anytime with one click.",
    icon: Globe2,
  },
];

export const FeaturesGrid = () => {
  return (
    <div className="w-full max-w-6xl mt-8 md:mt-32 px-2 md:px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="group p-4 md:p-8 rounded-xl md:rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="bg-primary/10 rounded-lg p-2 md:p-3 w-fit group-hover:scale-110 transition-transform duration-300">
              <feature.icon className="w-5 h-5 md:w-7 md:h-7 text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mt-3 mb-1 md:mt-4 md:mb-2 text-gray-800">{feature.title}</h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};