import React, { useState } from 'react';

function AccountSettingUser() {
  const [activeTab, setActiveTab] = useState('profile');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            {/* Add profile settings form */}
          </div>
        );
      case 'security':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            {/* Add change password form */}
          </div>
        );
      case 'notifications':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
            {/* Add notification settings options */}
          </div>
        );
      case 'privacy':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Privacy Settings</h2>
            {/* Add privacy settings options */}
          </div>
        );
      case 'billing':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Billing Settings</h2>
            {/* Add billing settings options */}
          </div>
        );
      case 'connected':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Connected Accounts</h2>
            {/* Add connected accounts options */}
          </div>
        );
      case 'preferences':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Preferences</h2>
            {/* Add preferences options */}
          </div>
        );
      case 'help':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Help & Support</h2>
            {/* Add help & support options */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex m-4">
      <div className="h-full w-1/4 bg-gray-200 p-4 border border-black">
        <ul className="flex flex-col space-y-2">
          <div>

          </div>
          <li className={`py-2 px-4 cursor-pointer ${activeTab === 'profile' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('profile')}>
            Profile Settings
          </li>
          <li className={`py-2 px-4 cursor-pointer ${activeTab === 'security' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('security')}>
            Security Settings
          </li>
          <li className={`py-2 px-4 cursor-pointer ${activeTab === 'notifications' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('notifications')}>
            Notification Settings
          </li>
          <li className={`py-2 px-4 cursor-pointer ${activeTab === 'privacy' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('privacy')}>
            Privacy Settings
          </li>
          <li className={`py-2 px-4 cursor-pointer ${activeTab === 'billing' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('billing')}>
            Billing Settings
          </li>
          <li className={`py-2 px-4 cursor-pointer ${activeTab === 'connected' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('connected')}>
            Connected Accounts
          </li>
          <li className={`py-2 px-4 cursor-pointer ${activeTab === 'preferences' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('preferences')}>
            Preferences
          </li>
          <li className={`py-2 px-4 cursor-pointer ${activeTab === 'help' ? 'bg-blue-500 text-white' : ''}`} onClick={() => handleTabClick('help')}>
            Help & Support
          </li>
        </ul>
      </div>
      <div className="w-full bg-gray-200 p-4 border-t border-r border-b border-black">
        {renderContent()}
      </div>
    </div>
  );
}

export default AccountSettingUser;