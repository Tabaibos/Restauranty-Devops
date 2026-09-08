import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { BiListUl, BiSolidDiscount } from "react-icons/bi";
import { MdCampaign } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { Link } from "react-router-dom";

function HomePage() {
  const { user } = useContext(AuthContext);

  const cards = [
    { title: "Items", description: "Manage your menu items", icon: <BiListUl className="text-3xl text-primary-600" />, link: "/items" },
    { title: "Coupons", description: "Create and manage discount codes", icon: <BiSolidDiscount className="text-3xl text-primary-600" />, link: "/discounts/coupons" },
    { title: "Campaigns", description: "Run marketing campaigns", icon: <MdCampaign className="text-3xl text-primary-600" />, link: "/discounts/campaigns" },
    { title: "Categories", description: "Organize your menu categories", icon: <BiSolidCategoryAlt className="text-3xl text-primary-600" />, link: "/dietary" },
  ];

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {user ? `Hello, ${user.name}!` : 'Dashboard'}
        </h1>
        <p className="text-gray-500 mt-2">Welcome to your restaurant management dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link key={card.title} to={card.link}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-200 transition-all duration-300 cursor-pointer group">
              <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                {card.icon}
              </div>
              <h3 className="font-semibold text-gray-800 text-lg mb-1">{card.title}</h3>
              <p className="text-gray-500 text-sm">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
