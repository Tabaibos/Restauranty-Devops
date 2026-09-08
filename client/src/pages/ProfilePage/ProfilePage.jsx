import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { FaCircleUser, FaLocationDot, FaPhoneFlip } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

function ProfilePage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-lg">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
            <FaCircleUser className="text-3xl text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {user ? `${user.name} ${user.surname}` : 'User'}
            </h2>
            <span className="text-xs font-medium px-2 py-1 bg-primary-50 text-primary-700 rounded-full">
              {user?.role || 'user'}
            </span>
          </div>
        </div>

        {user && (
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <MdEmail className="mr-3 text-gray-400" />
              <span className="text-sm">{user.email}</span>
            </div>
            {user.address && (
              <div className="flex items-center text-gray-600">
                <FaLocationDot className="mr-3 text-gray-400" />
                <span className="text-sm">{user.address}</span>
              </div>
            )}
            {user.phoneNumber && (
              <div className="flex items-center text-gray-600">
                <FaPhoneFlip className="mr-3 text-gray-400" />
                <span className="text-sm">{user.phoneNumber}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
