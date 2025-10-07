"use client";

export default function FeatureCards() {
  const features = [
    {
      icon: "🔒",
      title: "Secure Storage",
      description: "Your passwords are encrypted and stored securely with industry-standard protection."
    },
    {
      icon: "⚡",
      title: "Quick Access",
      description: "Generate and save passwords instantly. Access them anytime from your dashboard."
    },
    {
      icon: "🎯",
      title: "Simple Management",
      description: "Organize with tags, search instantly, and manage all your credentials in one place."
    }
  ];

  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <div 
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="text-4xl mb-3">{feature.icon}</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
