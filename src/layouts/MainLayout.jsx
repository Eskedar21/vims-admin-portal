import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Fixed width, dark background */}
      <Sidebar />
      
      {/* Content Wrapper - Takes remaining space */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header - Fixed height, white background */}
        <Header />
        
        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;


