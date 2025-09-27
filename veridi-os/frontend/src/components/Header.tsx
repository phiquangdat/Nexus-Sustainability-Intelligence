import NotificationCenter from "./NotificationCenter";

const Header = () => {
  return (
    <header className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">The Nexus Team</h1>
            <p className="text-green-100 mt-2">
              Sustainability Reporting Platform
            </p>
            <p className="text-sm text-green-200 mt-1">
              Wärtsilä Power Plant Reporting
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationCenter />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
