import NotificationCenter from "./NotificationCenter";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">N</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                  The Nexus Team
                </h1>
                <p className="text-green-100 text-lg font-medium">
                  Sustainability Intelligence Platform
                </p>
                <p className="text-sm text-green-200">
                  Advanced Power Plant Monitoring & EU ETS Compliance
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 shadow-lg">
              <NotificationCenter />
            </div>
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
    </header>
  );
};

export default Header;
