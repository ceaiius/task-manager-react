import React, { useState, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../context/AuthContext'; 
import { getUserProfile, updateUserName, changeUserPassword, UserData } from '../api/auth';

const Profile = () => {
    const auth = useContext(AuthContext);
    const queryClient = useQueryClient();

    const [name, setName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [nameUpdateStatus, setNameUpdateStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [passwordUpdateStatus, setPasswordUpdateStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const { data: userData, isLoading: isLoadingProfile, isError: isProfileError, error: profileError } = useQuery<UserData, Error>({
        queryKey: ['userProfile'],
        queryFn: getUserProfile,
        enabled: !!auth?.isAuthenticated,
        initialData: auth?.user, 
        staleTime: 5 * 60 * 1000, 
    });

    useEffect(() => {
        if (userData?.name) {
            setName(userData.name);
        }
    }, [userData]);

    const updateNameMutation = useMutation<UserData, Error, string>({
        mutationFn: updateUserName,
        onSuccess: (updatedUserData) => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            auth?.updateUserContext(updatedUserData);
            setNameUpdateStatus({ type: 'success', message: 'Name updated successfully!' });
            setTimeout(() => setNameUpdateStatus(null), 3000);
        },
        onError: (error) => {
            setNameUpdateStatus({ type: 'error', message: error.message || 'Failed to update name.' });
        }
    });

    const changePasswordMutation = useMutation<{ message: string }, Error, Parameters<typeof changeUserPassword>[0]>({
        mutationFn: changeUserPassword,
        onSuccess: (data) => {
            setPasswordUpdateStatus({ type: 'success', message: data.message || 'Password changed successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setPasswordUpdateStatus(null), 3000);
        },
        onError: (error) => {
            const apiErrorMessage = (error as any)?.response?.data?.message;
            setPasswordUpdateStatus({ type: 'error', message: apiErrorMessage || error.message || 'Failed to change password.' });
        }
    });

    const handleNameUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setNameUpdateStatus(null); 
        if (name.trim() && name !== userData?.name) {
            updateNameMutation.mutate(name.trim());
        } else if (name === userData?.name) {
             setNameUpdateStatus({ type: 'error', message: 'Name is the same.' });
        } else {
             setNameUpdateStatus({ type: 'error', message: 'Name cannot be empty.' });
        }
    };

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordUpdateStatus(null); 

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordUpdateStatus({ type: 'error', message: 'All password fields are required.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordUpdateStatus({ type: 'error', message: 'New passwords do not match.' });
            return;
        }
        if (newPassword.length < 8) { 
             setPasswordUpdateStatus({ type: 'error', message: 'New password must be at least 8 characters.' });
             return;
        }

        changePasswordMutation.mutate({
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: confirmPassword,
        });
    };


    if (isLoadingProfile && !auth?.user) {
        return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>;
    }

    if (isProfileError) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading profile: {profileError?.message}</div>;
    }

    if (!userData) {
         return <div className="min-h-screen flex items-center justify-center text-gray-500">Could not load profile data.</div>;
    }


    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-center text-4xl font-extrabold text-gray-900">
                    Profile Settings
                </h1>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Information</h2>
                    <div className="space-y-2">
                        <p><span className="font-medium text-gray-600">Name:</span> {userData.name}</p>
                        <p><span className="font-medium text-gray-600">Email:</span> {userData.email}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Name</h2>
                    <form onSubmit={handleNameUpdate} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                disabled={updateNameMutation.isLoading}
                            />
                        </div>

                        {nameUpdateStatus && (
                            <p className={`text-sm ${nameUpdateStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {nameUpdateStatus.message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={updateNameMutation.isLoading || name === userData.name}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updateNameMutation.isLoading ? (
                                <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Updating...
                                </>
                            ) : (
                                'Update Name'
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Current Password</label>
                            <input
                                id="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                disabled={changePasswordMutation.isLoading}
                            />
                        </div>
                         <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                disabled={changePasswordMutation.isLoading}
                            />
                        </div>
                         <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                disabled={changePasswordMutation.isLoading}
                            />
                        </div>

                        {passwordUpdateStatus && (
                             <p className={`text-sm ${passwordUpdateStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {passwordUpdateStatus.message}
                            </p>
                        )}

                        <button
                             type="submit"
                             disabled={changePasswordMutation.isLoading}
                             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                             {changePasswordMutation.isLoading ? (
                                <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Changing...
                                </>
                             ) : (
                                'Change Password'
                             )}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Profile;